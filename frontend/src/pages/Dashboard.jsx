import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import dndService from '../api/dndService';
import CreateCharacterForm from '../components/CreateCharacterForm';
import CharacterDetailModal from '../components/CharacterDetailModal';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'create'
  const [personagens, setPersonagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPersonagem, setSelectedPersonagem] = useState(null);

  const carregarPersonagens = async () => {
    setLoading(true);
    try {
      const lista = await dndService.listarPersonagens();
      setPersonagens(lista);
    } catch (err) {
      console.error('Erro ao carregar personagens:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPersonagens();
  }, []);

  const handleCharacterCreated = (novoPersonagem) => {
    setPersonagens((prev) => [novoPersonagem, ...prev.filter((p) => p.id !== novoPersonagem.id)]);
    setActiveTab('list');
  };

  const calcModifier = (score) => {
    const mod = Math.floor(((Number(score) || 10) - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  return (
    <div className="container py-4 fade-in">
      {/* Cabeçalho do Aventureiro */}
      <div className="card rpg-card p-4 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-warning bg-opacity-25 text-gold border border-warning font-rpg">
                <i className="bi bi-shield-shaded me-1"></i> Taverna do D&D
              </span>
              <span className="badge bg-dark border border-secondary text-light font-rpg">
                {personagens.length} {personagens.length === 1 ? 'Personagem' : 'Personagens'}
              </span>
            </div>
            <h1 className="h3 font-rpg text-gold mb-1">
              Bem-vindo, {user?.nome || user?.email?.split('@')[0] || 'Aventureiro'}!
            </h1>
            <p className="text-muted small mb-0 font-rpg">
              Gerencie suas fichas de heróis e campanhas para Dungeons & Dragons 5e / 5.5e
            </p>
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              className={`btn ${activeTab === 'list' ? 'btn-dnd-gold' : 'btn-dnd-outline'}`}
              onClick={() => setActiveTab('list')}
            >
              <i className="bi bi-person-lines-fill me-1"></i> Meus Personagens
            </button>

            <button
              type="button"
              className={`btn ${activeTab === 'create' ? 'btn-dnd-crimson' : 'btn-dnd-outline'}`}
              onClick={() => setActiveTab('create')}
            >
              <i className="bi bi-plus-circle-fill me-1"></i> Criar Personagem
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo da Aba Ativa */}
      {activeTab === 'create' ? (
        <CreateCharacterForm
          onSuccess={handleCharacterCreated}
          onCancel={() => setActiveTab('list')}
        />
      ) : (
        <div>
          {/* Barra de Filtro / Ações da Lista */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h4 font-rpg text-gold mb-0">
              <i className="bi bi-collection-fill me-2"></i>Fichas Registradas
            </h2>

            <button
              type="button"
              className="btn btn-sm btn-dnd-crimson d-flex align-items-center gap-1"
              onClick={() => setActiveTab('create')}
            >
              <i className="bi bi-plus-lg"></i>
              <span>Novo Personagem</span>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Carregando fichas...</span>
              </div>
              <p className="text-muted small mt-2 font-rpg">Buscando personagens na Taverna...</p>
            </div>
          ) : personagens.length === 0 ? (
            /* Estado Vazio */
            <div className="card rpg-card text-center py-5 px-3">
              <div className="card-body">
                <i className="bi bi-shield-slash text-gold fs-1 mb-3 d-block opacity-75"></i>
                <h3 className="h4 font-rpg text-gold mb-2">Nenhum Personagem Encontrado</h3>
                <p className="text-muted small mb-4 mx-auto" style={{ maxWidth: '450px' }}>
                  Você ainda não possui fichas criadas para suas campanhas. Forje seu primeiro herói escolhendo raça, classe, atributos e magias!
                </p>
                <button
                  type="button"
                  className="btn btn-dnd-crimson btn-lg px-4"
                  onClick={() => setActiveTab('create')}
                >
                  <i className="bi bi-magic me-2"></i>Criar Primeiro Personagem
                </button>
              </div>
            </div>
          ) : (
            /* Grade de Cards de Personagens */
            <div className="row g-4">
              {personagens.map((p) => (
                <div key={p.id} className="col-12 col-md-6 col-lg-4">
                  <div className="card rpg-card h-100 d-flex flex-column">
                    <div className="card-header rpg-card-header d-flex justify-content-between align-items-start">
                      <div>
                        <span className="badge bg-warning bg-opacity-10 text-gold border border-warning border-opacity-50 small mb-1 font-rpg">
                          Nível {p.nivel || 1}
                        </span>
                        <h3 className="h5 font-rpg text-gold mb-0 text-truncate" style={{ maxWidth: '200px' }}>
                          {p.nome}
                        </h3>
                      </div>
                      <span className="badge bg-dark border border-secondary text-light small font-rpg">
                        {p.raca}
                      </span>
                    </div>

                    <div className="card-body p-3 d-flex flex-column justify-content-between flex-grow-1">
                      <div>
                        {/* Classe e Subclasse */}
                        <div className="text-muted small mb-3 font-rpg">
                          <i className="bi bi-award me-1 text-gold"></i>
                          <strong className="text-light">{p.classe}</strong>
                          {p.subclasse && p.subclasse !== 'Nenhuma' && (
                            <span className="text-secondary fw-semibold"> • {p.subclasse}</span>
                          )}
                        </div>

                        {/* Estatísticas Vitais */}
                        <div className="row g-2 mb-3 text-center">
                          <div className="col-6">
                            <div className="bg-dark p-2 rounded border border-danger border-opacity-25">
                              <span className="text-crimson font-rpg small d-block" style={{ fontSize: '0.75rem' }}>
                                <i className="bi bi-heart-fill me-1"></i> HP MÁX
                              </span>
                              <span className="h5 text-danger font-rpg fw-bold mb-0">{p.hp || 10}</span>
                            </div>
                          </div>

                          <div className="col-6">
                            <div className="bg-dark p-2 rounded border border-info border-opacity-25">
                              <span className="text-arcane font-rpg small d-block" style={{ fontSize: '0.75rem' }}>
                                <i className="bi bi-shield-fill me-1"></i> ARMADURA (CA)
                              </span>
                              <span className="h5 text-info font-rpg fw-bold mb-0">{p.classeArmadura || 10}</span>
                            </div>
                          </div>
                        </div>

                        {/* Grade Resumida de Atributos */}
                        <div className="bg-dark p-2 rounded border border-warning border-opacity-25 mb-3">
                          <div className="row g-1 text-center" style={{ fontSize: '0.7rem' }}>
                            {[
                              { label: 'FOR', val: p.forca },
                              { label: 'DES', val: p.destreza },
                              { label: 'CON', val: p.constituicao },
                              { label: 'INT', val: p.inteligencia },
                              { label: 'SAB', val: p.sabedoria },
                              { label: 'CAR', val: p.carisma },
                            ].map((atr) => (
                              <div key={atr.label} className="col-4 col-sm-2">
                                <span className="text-muted d-block">{atr.label}</span>
                                <span className="text-gold fw-bold">{atr.val ?? 10}</span>
                                <span className="text-info d-block" style={{ fontSize: '0.65rem' }}>
                                  ({calcModifier(atr.val)})
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Botão de Ação */}
                      <button
                        type="button"
                        className="btn btn-sm btn-dnd-outline w-100 mt-2"
                        onClick={() => setSelectedPersonagem(p)}
                      >
                        <i className="bi bi-eye me-1"></i> Ver Ficha Completa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal de Detalhes da Ficha */}
      <CharacterDetailModal
        personagem={selectedPersonagem}
        onClose={() => setSelectedPersonagem(null)}
      />
    </div>
  );
};

export default Dashboard;
