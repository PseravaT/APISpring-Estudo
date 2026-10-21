import {
  dndManagerApi,
  setStoredToken,
  setStoredUser,
  getStoredToken,
  getStoredUser,
  removeStoredAuth,
} from './apiClient';

/**
 * Serviço responsável por autenticação e gerenciamento de usuários
 */
export const authService = {
  /**
   * Realiza login no backend dndmanager
   * @param {string} email
   * @param {string} senha
   * @returns {Promise<{ token: string, user: { email: string } }>}
   */
  async login(email, senha) {
    try {
      const response = await dndManagerApi.post('/auth/login', {
        email: email.trim(),
        senha,
      });

      const { token } = response.data;
      if (token) {
        setStoredToken(token);
        const userData = { email: email.trim() };
        setStoredUser(userData);
        return { token, user: userData };
      }

      throw new Error('Token não retornado pela API.');
    } catch (error) {
      console.error('Erro no login:', error);
      let message = 'Falha ao autenticar aventureiro.';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.status === 403 || error.response?.status === 401) {
        message = 'Credenciais inválidas. Verifique seu e-mail e senha.';
      } else if (error.message === 'Network Error') {
        message = 'Falha de conexão com a Taverna. Verifique se o dndmanager está rodando na porta 8080.';
      } else if (error.message) {
        message = error.message;
      }
      throw new Error(message);
    }
  },

  /**
   * Realiza o cadastro de um novo usuário no sistema
   * @param {string} nome
   * @param {string} email
   * @param {string} senha
   * @returns {Promise<{ id: number, nome: string, email: string }>}
   */
  async cadastrar(nome, email, senha) {
    try {
      const response = await dndManagerApi.post('/usuarios', {
        nome: nome.trim(),
        email: email.trim(),
        senha,
      });

      return response.data;
    } catch (error) {
      console.error('Erro no cadastro:', error);
      let message = 'Não foi possível concluir o cadastro do aventureiro.';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.response?.data?.errors) {
        message = Object.values(error.response.data.errors).join(', ');
      } else if (error.message === 'Network Error') {
        message = 'Falha de conexão com a Taverna. Verifique se o dndmanager está rodando na porta 8080.';
      } else if (error.message) {
        message = error.message;
      }
      throw new Error(message);
    }
  },

  /**
   * Testa a validade do token JWT consultando o endpoint protegido /usuarios/me
   * @returns {Promise<string>} Mensagem de boas-vindas da Taverna
   */
  async testarAutenticacao() {
    try {
      const response = await dndManagerApi.get('/usuarios/me');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Sessão expirada ou não autorizada.'
      );
    }
  },

  /**
   * Encerra a sessão local
   */
  logout() {
    removeStoredAuth();
  },

  /**
   * Obtém o token armazenado
   */
  getToken() {
    return getStoredToken();
  },

  /**
   * Obtém o usuário armazenado
   */
  getCurrentUser() {
    return getStoredUser();
  },

  /**
   * Verifica se há um token presente
   */
  isAuthenticated() {
    return !!getStoredToken();
  },
};

export default authService;
