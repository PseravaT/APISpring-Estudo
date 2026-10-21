import React from 'react';

const SKILLS_BY_ATTR = {
  forca: ['Atletismo'],
  destreza: ['Acrobacia', 'Furtividade', 'Prestidigitação'],
  constituicao: [],
  inteligencia: ['Arcanismo', 'História', 'Investigação', 'Natureza', 'Religião'],
  sabedoria: ['Lidar com Animais', 'Intuição', 'Medicina', 'Percepção', 'Sobrevivência'],
  carisma: ['Atuação', 'Enganação', 'Intimidação', 'Persuasão'],
};

export const CharacterDetailModal = ({ personagem, onClose }) => {
  if (!personagem) return null;

  const profBonus = Math.floor(((Number(personagem.nivel) || 1) - 1) / 4) + 2;

  const calcModifier = (score) => {
    const mod = Math.floor(((Number(score) || 10) - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const getAttrRawMod = (score) => {
    return Math.floor(((Number(score) || 10) - 10) / 2);
  };

  const formatMod = (mod) => {
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const getSkillBonus = (attrScore, skillName) => {
    const rawMod = getAttrRawMod(attrScore);
    const isProf = Array.isArray(personagem.pericias) && personagem.pericias.includes(skillName);
    const total = isProf ? rawMod + profBonus : rawMod;
    return formatMod(total);
  };

  const ATTR_LIST = [
    { key: 'forca', label: 'FORÇA', short: 'FOR', val: personagem.forca, icon: 'bi-lightning-charge' },
    { key: 'destreza', label: 'DESTREZA', short: 'DES', val: personagem.destreza, icon: 'bi-wind' },
    { key: 'constituicao', label: 'CONSTITUIÇÃO', short: 'CON', val: personagem.constituicao, icon: 'bi-heart-pulse' },
    { key: 'inteligencia', label: 'INTELIGÊNCIA', short: 'INT', val: personagem.inteligencia, icon: 'bi-lightbulb' },
    { key: 'sabedoria', label: 'SABEDORIA', short: 'SAB', val: personagem.sabedoria, icon: 'bi-eye' },
    { key: 'carisma', label: 'CARISMA', short: 'CAR', val: personagem.carisma, icon: 'bi-chat-heart' },
  ];

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(5px)' }}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content rpg-card border border-warning border-opacity-50">
          <div className="modal-header rpg-card-header d-flex justify-content-between align-items-center">
            <div>
              <span className="badge bg-warning bg-opacity-25 text-gold border border-warning font-rpg mb-1 me-2">
                Nível {personagem.nivel}
              </span>
              <span className="badge bg-dark border border-secondary text-light font-rpg mb-1">
                Bônus Proficiência: +{profBonus}
              </span>
              <h3 className="modal-title h4 font-rpg text-gold mb-0">{personagem.nome}</h3>
              <small className="text-muted font-rpg">
                {personagem.raca} • {personagem.classe} {personagem.subclasse && personagem.subclasse !== 'Nenhuma' ? `(${personagem.subclasse})` : ''}
              </small>
            </div>
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onClose}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <div className="modal-body p-4">
            {/* Indicadores Vitais */}
            <div className="row g-3 mb-4 text-center">
              <div className="col-4">
                <div className="bg-dark p-2 rounded border border-danger border-opacity-50">
                  <div className="text-crimson font-rpg small">
                    <i className="bi bi-heart-fill me-1"></i> PONTOS DE VIDA
                  </div>
                  <div className="h3 text-danger mb-0 font-rpg fw-bold">{personagem.hp} HP</div>
                </div>
              </div>

              <div className="col-4">
                <div className="bg-dark p-2 rounded border border-info border-opacity-50">
                  <div className="text-arcane font-rpg small">
                    <i className="bi bi-shield-fill me-1"></i> CLASSE DE ARMADURA
                  </div>
                  <div className="h3 text-info mb-0 font-rpg fw-bold">{personagem.classeArmadura} CA</div>
                </div>
              </div>

              <div className="col-4">
                <div className="bg-dark p-2 rounded border border-warning border-opacity-50">
                  <div className="text-gold font-rpg small">
                    <i className="bi bi-trophy-fill me-1"></i> NÍVEL ATUAL
                  </div>
                  <div className="h3 text-gold mb-0 font-rpg fw-bold">NV {personagem.nivel}</div>
                </div>
              </div>
            </div>

            {/* Layout Oficial: Atributos com Perícias Logo Abaixo */}
            <h5 className="font-rpg text-gold mb-3 border-bottom border-warning border-opacity-25 pb-2">
              <i className="bi bi-collection-fill me-2"></i>Atributos & Perícias Oficiais (D&D 5e / 5.5e)
            </h5>

            <div className="row g-3 mb-4">
              {ATTR_LIST.map((atr) => {
                const skills = SKILLS_BY_ATTR[atr.key] || [];

                return (
                  <div key={atr.key} className="col-12 col-md-6 col-lg-4">
                    <div className="card bg-dark border border-warning border-opacity-40 p-3 h-100">
                      {/* Cabeçalho do Atributo */}
                      <div className="d-flex justify-content-between align-items-center mb-2 pb-1 border-bottom border-warning border-opacity-25">
                        <span className="font-rpg text-gold fw-bold small">
                          <i className={`bi ${atr.icon} me-1`}></i> {atr.label}
                        </span>
                        <span className="badge bg-secondary bg-opacity-25 text-info font-monospace small">
                          Mod: {calcModifier(atr.val)}
                        </span>
                      </div>

                      {/* Valor do Atributo */}
                      <div className="d-flex justify-content-between align-items-center bg-black bg-opacity-40 p-2 rounded mb-2">
                        <span className="text-muted small font-rpg">Pontuação:</span>
                        <span className="h4 text-light font-rpg fw-bold mb-0">{atr.val ?? 10}</span>
                      </div>

                      {/* Perícias do Atributo */}
                      {skills.length > 0 ? (
                        <div className="pt-1">
                          <span className="text-muted font-rpg d-block mb-1" style={{ fontSize: '0.65rem' }}>
                            PERÍCIAS:
                          </span>
                          <div className="d-flex flex-column gap-1">
                            {skills.map((skillName) => {
                              const isProf = Array.isArray(personagem.pericias) && personagem.pericias.includes(skillName);
                              const bonus = getSkillBonus(atr.val, skillName);

                              return (
                                <div
                                  key={skillName}
                                  className={`p-1 px-2 rounded d-flex justify-content-between align-items-center ${
                                    isProf ? 'bg-warning bg-opacity-10 border border-warning border-opacity-25' : ''
                                  }`}
                                  style={{ fontSize: '0.78rem' }}
                                >
                                  <span className={isProf ? 'text-gold fw-bold' : 'text-light'}>
                                    <i className={`bi ${isProf ? 'bi-check-circle-fill text-warning' : 'bi-circle text-secondary'} me-1`}></i>
                                    {skillName}
                                  </span>
                                  <span className={`badge font-monospace ${isProf ? 'bg-warning text-dark' : 'bg-secondary bg-opacity-25 text-light'}`}>
                                    {bonus}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-2">
                          <span className="text-muted font-rpg fst-italic" style={{ fontSize: '0.7rem' }}>
                            (Sem perícias diretas)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Magias se houver */}
            {personagem.magias && (
              <div>
                <h5 className="font-rpg text-gold mb-2 border-bottom border-warning border-opacity-25 pb-2">
                  <i className="bi bi-journal-bookmark me-2"></i>Magias & Notas do Aventureiro
                </h5>
                <div className="bg-dark p-3 rounded border border-secondary border-opacity-25 small text-light">
                  {personagem.magias}
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer bg-transparent border-top border-secondary border-opacity-25">
            <button type="button" className="btn btn-dnd-outline" onClick={onClose}>
              Fechar Ficha
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetailModal;
