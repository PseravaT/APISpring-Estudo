import { dndManagerApi, dadosApi, getStoredUser } from './apiClient';

const CACHE_PERSONAGENS_PREFIX = 'dnd_cached_personagens_';

const getCacheKey = () => {
  const user = getStoredUser();
  return `${CACHE_PERSONAGENS_PREFIX}${user?.email || 'anon'}`;
};

const getLocalCharacters = () => {
  try {
    const raw = localStorage.getItem(getCacheKey());
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
};

const saveLocalCharacters = (chars) => {
  try {
    localStorage.setItem(getCacheKey(), JSON.stringify(chars));
  } catch (err) {
    console.warn('Falha ao salvar cache de personagens:', err);
  }
};

/**
 * Serviços para integração com Dndmanager e APIdados
 */
export const dndService = {
  /**
   * Obtém rolagens de atributos (6 valores para FOR, DES, CON, INT, SAB, CAR)
   */
  async rolarAtributos() {
    try {
      // Tenta primeiro APIdados direta (porta 8081)
      const response = await dadosApi.get('/api/rolagens/atributos');
      return response.data;
    } catch (e1) {
      try {
        // Tenta endpoint proxy no dndmanager
        const response = await dndManagerApi.get('/personagens/rolagens');
        return response.data;
      } catch (e2) {
        // Fallback para geração clássica D&D 4d6 drop lowest no frontend se os serviços estiverem offline
        console.warn('Serviço de rolagem indisponível, simulando 4d6 clássico.');
        return Array.from({ length: 6 }, () => {
          const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
          rolls.sort((a, b) => a - b);
          return rolls[1] + rolls[2] + rolls[3];
        });
      }
    }
  },

  /**
   * Lista todos os personagens do usuário autenticado
   * @returns {Promise<Array>}
   */
  async listarPersonagens() {
    try {
      const response = await dndManagerApi.get('/personagens');
      const apiChars = Array.isArray(response.data) ? response.data : [];
      if (apiChars.length > 0) {
        saveLocalCharacters(apiChars);
        return apiChars;
      }
    } catch (error) {
      console.warn('Endpoint GET /personagens não disponível ainda no backend, usando cache local:', error);
    }
    return getLocalCharacters();
  },

  /**
   * Cria uma nova ficha de personagem vinculada ao usuário autenticado no backend
   * @param {Object} personagemData
   * @returns {Promise<Object>}
   */
  async criarPersonagem(personagemData) {
    try {
      const response = await dndManagerApi.post('/personagens', {
        nome: personagemData.nome,
        raca: personagemData.raca,
        classe: personagemData.classe,
        subclasse: personagemData.subclasse || 'Nenhuma',
        nivel: Number(personagemData.nivel) || 1,
        hp: Number(personagemData.hp) || 10,
        classeArmadura: Number(personagemData.classeArmadura) || 10,
        forca: Number(personagemData.forca) || 10,
        destreza: Number(personagemData.destreza) || 10,
        constituicao: Number(personagemData.constituicao) || 10,
        inteligencia: Number(personagemData.inteligencia) || 10,
        sabedoria: Number(personagemData.sabedoria) || 10,
        carisma: Number(personagemData.carisma) || 10,
      });

      const savedPersonagem = {
        ...response.data,
        pericias: personagemData.pericias,
        magias: personagemData.magias,
      };

      const current = getLocalCharacters();
      saveLocalCharacters([savedPersonagem, ...current.filter((c) => c.id !== savedPersonagem.id)]);
      return savedPersonagem;
    } catch (error) {
      console.error('Erro na requisição para criar personagem:', error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (error.response?.status === 403
          ? 'Sessão não autorizada ou expirada (HTTP 403). Faça login novamente ou reinicie a aplicação backend.'
          : error.message || 'Falha ao salvar a ficha do personagem no banco de dados.');
      throw new Error(message);
    }
  },
};

export default dndService;
