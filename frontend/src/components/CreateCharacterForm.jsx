import React, { useState, useEffect } from 'react';
import dndService from '../api/dndService';

const RACAS_DND = [
  'Humano',
  'Elfo',
  'Anão',
  'Halfling',
  'Draconato',
  'Tiefling',
  'Gnomo',
  'Meio-Elfo',
  'Meio-Orc',
  'Goliath',
  'Aasimar',
];

// Classes exclusivas solicitadas pelo usuário
const CLASSES_DND = [
  'Artífice',
  'Bárbaro',
  'Bardo',
  'Bruxo',
  'Clérigo',
  'Druida',
  'Feiticeiro',
  'Guerreiro',
  'Ladino',
  'Mago',
  'Monge',
  'Paladino',
  'Patrulheiro / Guardião',
];

// Vida Máxima (PV) Base no Nível 1 por Classe (Regras Oficiais D&D 5e / 5.5e):
// • Bárbaro: 12 + CON
// • Guerreiro, Paladino, Guardião: 10 + CON
// • Bardo, Clérigo, Druida, Ladino, Monge, Bruxo, Artífice: 8 + CON
// • Feiticeiro, Mago: 6 + CON
const HIT_POINTS_BASE_POR_CLASSE = {
  'Bárbaro': 12,
  'Guerreiro': 10,
  'Paladino': 10,
  'Patrulheiro / Guardião': 10,
  'Guardião': 10,
  'Patrulheiro': 10,
  'Artífice': 8,
  'Bardo': 8,
  'Bruxo': 8,
  'Clérigo': 8,
  'Druida': 8,
  'Ladino': 8,
  'Monge': 8,
  'Feiticeiro': 6,
  'Mago': 6,
};

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

// Configuração dos 6 atributos com suas perícias correspondentes (oficial D&D 5e / 5.5e)
const ATRIBUTOS_CONFIG = [
  {
    key: 'forca',
    label: 'FORÇA',
    short: 'FOR',
    icon: 'bi-lightning-charge',
    col: 1,
    pericias: ['Atletismo'],
  },
  {
    key: 'destreza',
    label: 'DESTREZA',
    short: 'DES',
    icon: 'bi-wind',
    col: 1,
    pericias: ['Acrobacia', 'Furtividade', 'Prestidigitação'],
  },
  {
    key: 'constituicao',
    label: 'CONSTITUIÇÃO',
    short: 'CON',
    icon: 'bi-heart-pulse',
    col: 1,
    pericias: [], // Constituição não possui perícias associadas no D&D oficial
  },
  {
    key: 'inteligencia',
    label: 'INTELIGÊNCIA',
    short: 'INT',
    icon: 'bi-lightbulb',
    col: 2,
    pericias: ['Arcanismo', 'História', 'Investigação', 'Natureza', 'Religião'],
  },
  {
    key: 'sabedoria',
    label: 'SABEDORIA',
    short: 'SAB',
    icon: 'bi-eye',
    col: 2,
    pericias: ['Lidar com Animais', 'Intuição', 'Medicina', 'Percepção', 'Sobrevivência'],
  },
  {
    key: 'carisma',
    label: 'CARISMA',
    short: 'CAR',
    icon: 'bi-chat-heart',
    col: 2,
    pericias: ['Atuação', 'Enganação', 'Intimidação', 'Persuasão'],
  },
];

export const CreateCharacterForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: '',
    raca: 'Humano',
    classe: 'Patrulheiro / Guardião',
    subclasse: 'Caçador',
    nivel: 1,
    hp: 10,
    classeArmadura: 14,
  });

  // Pool de valores disponíveis (iniciado com o Standard Array do D&D)
  const [pool, setPool] = useState(() =>
    STANDARD_ARRAY.map((val, idx) => ({ id: `std-${idx}`, val }))
  );

  // Mapeamento: atributo -> id do item no pool (inicia VAZIO para o usuário escolher cada um)
  const [allocations, setAllocations] = useState({
    forca: null,
    destreza: null,
    constituicao: null,
    inteligencia: null,
    sabedoria: null,
    carisma: null,
  });

  // Limite de 3 rerolagens conforme especificado
  const [rerollsLeft, setRerollsLeft] = useState(3);
  const [selectedPoolId, setSelectedPoolId] = useState(null);

  // Perícias e Salvaguardas treinadas (proficiências)
  const [periciasSelecionadas, setPericiasSelecionadas] = useState(['Percepção', 'Sobrevivência', 'Furtividade']);
  const [salvaguardasSelecionadas, setSalvaguardasSelecionadas] = useState(['forca', 'destreza']);
  const [inspiracaoHeroica, setInspiracaoHeroica] = useState(false);

  const [magias, setMagias] = useState('Marca do Caçador, Falar com Animais');
  const [loading, setLoading] = useState(false);
  const [rollingDice, setRollingDice] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // Bônus de Proficiência oficial D&D 5e/5.5e baseado no nível
  const profBonus = Math.floor(((Number(formData.nivel) || 1) - 1) / 4) + 2;

  const getAttrValue = (key) => {
    const poolId = allocations[key];
    if (!poolId) return null;
    const item = pool.find((p) => p.id === poolId);
    return item ? item.val : null;
  };

  const getAttrRawMod = (key) => {
    const score = getAttrValue(key);
    if (score === null) return null;
    return Math.floor(((Number(score) || 10) - 10) / 2);
  };

  const formatMod = (mod) => {
    if (mod === null) return '—';
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const getBaseHpForClass = (classe) => {
    return HIT_POINTS_BASE_POR_CLASSE[classe] || 8;
  };

  // Recálculo automático de Vida Máxima (PV) no Nível 1 conforme a Classe e Modificador de Constituição
  useEffect(() => {
    if (Number(formData.nivel) === 1) {
      const base = getBaseHpForClass(formData.classe);
      const modCon = getAttrRawMod('constituicao');
      // No nível 1: Dado de vida cheio da classe + modificador de Constituição (mínimo 1 PV)
      const calculatedHp = Math.max(1, base + (modCon !== null ? modCon : 0));
      setFormData((prev) => ({
        ...prev,
        hp: calculatedHp,
      }));
    }
  }, [formData.classe, formData.nivel, allocations.constituicao, pool]);

  // Cálculo do bônus de Salvaguarda
  const getSaveBonus = (attrKey) => {
    const rawMod = getAttrRawMod(attrKey);
    if (rawMod === null) return '—';
    const isProf = salvaguardasSelecionadas.includes(attrKey);
    const total = isProf ? rawMod + profBonus : rawMod;
    return formatMod(total);
  };

  // Cálculo do bônus da Perícia
  const getSkillBonus = (attrKey, skillName) => {
    const rawMod = getAttrRawMod(attrKey);
    if (rawMod === null) return '—';
    const isProf = periciasSelecionadas.includes(skillName);
    const total = isProf ? rawMod + profBonus : rawMod;
    return formatMod(total);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (parseInt(value, 10) || 0) : value,
    }));
  };

  const handleTogglePericia = (pericia) => {
    setPericiasSelecionadas((prev) =>
      prev.includes(pericia) ? prev.filter((p) => p !== pericia) : [...prev, pericia]
    );
  };

  const handleToggleSalvaguarda = (attrKey) => {
    setSalvaguardasSelecionadas((prev) =>
      prev.includes(attrKey) ? prev.filter((k) => k !== attrKey) : [...prev, attrKey]
    );
  };

  // Troca inteligente ou vinculação de valores
  const handleAssign = (targetAttrKey, targetPoolId) => {
    // Opção de desvincular (vazio)
    if (!targetPoolId || targetPoolId === 'none') {
      setAllocations((prev) => ({ ...prev, [targetAttrKey]: null }));
      setSelectedPoolId(null);
      return;
    }

    setAllocations((prev) => {
      // Descobre qual atributo atualmente possui targetPoolId (se algum)
      const currentHolderAttr = Object.keys(prev).find(
        (key) => prev[key] === targetPoolId && key !== targetAttrKey
      );

      // Dado que estava atualmente no atributo alvo
      const currentTargetHolder = prev[targetAttrKey];

      const updated = { ...prev, [targetAttrKey]: targetPoolId };

      // Se outro atributo já possuía este dado, faz a troca (swap) ou libera
      if (currentHolderAttr) {
        updated[currentHolderAttr] = currentTargetHolder || null;
      }

      return updated;
    });

    const val = pool.find((p) => p.id === targetPoolId)?.val;
    const attr = ATRIBUTOS_CONFIG.find((a) => a.key === targetAttrKey);
    if (val !== undefined && attr) {
      setInfoMessage(`Valor ${val} vinculado com sucesso a ${attr.label}!`);
    }
    setSelectedPoolId(null);
  };

  // Rolar atributos via APIdados (máximo de 3 vezes) e zera atributos para preenchimento
  const handleRolarAtributos = async () => {
    if (rerollsLeft <= 0) {
      setErrorMessage('Você já utilizou todas as 3 rerolagens permitidas. Caso não goste dos valores, utilize o Array Padrão do D&D (15, 14, 13, 12, 10, 8).');
      return;
    }

    setRollingDice(true);
    setErrorMessage('');
    setInfoMessage('');
    try {
      const valores = await dndService.rolarAtributos();
      if (Array.isArray(valores) && valores.length >= 6) {
        const sorted = [...valores].sort((a, b) => b - a);
        const newPool = sorted.slice(0, 6).map((val, idx) => ({
          id: `roll-${Date.now()}-${idx}`,
          val,
        }));

        setPool(newPool);
        // Zera os atributos para ficarem vazios, permitindo que o usuário selecione onde cada valor vai
        setAllocations({
          forca: null,
          destreza: null,
          constituicao: null,
          inteligencia: null,
          sabedoria: null,
          carisma: null,
        });
        setSelectedPoolId(null);

        const restantes = rerollsLeft - 1;
        setRerollsLeft(restantes);
        setInfoMessage(
          `Novos valores rolados via APIdados! Rerolagens restantes: ${restantes}. Clique em um número do banco e selecione o atributo correspondente.`
        );
      }
    } catch (err) {
      setErrorMessage('Não foi possível obter rolagens automáticas da APIdados.');
    } finally {
      setRollingDice(false);
    }
  };

  // Restaurar Conjunto Padrão oficial do D&D e zera atributos para preenchimento
  const handleRestaurarPadrao = () => {
    const stdPool = STANDARD_ARRAY.map((val, idx) => ({ id: `std-${idx}`, val }));
    setPool(stdPool);
    // Zera os atributos para ficarem vazios
    setAllocations({
      forca: null,
      destreza: null,
      constituicao: null,
      inteligencia: null,
      sabedoria: null,
      carisma: null,
    });
    setSelectedPoolId(null);
    setErrorMessage('');
    setInfoMessage('Array Padrão (15, 14, 13, 12, 10, 8) pronto! Clique nos valores para vinculá-los aos atributos.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.nome.trim()) {
      setErrorMessage('Por favor, informe o nome do seu aventureiro.');
      return;
    }

    // Validação: todos os 6 atributos devem estar vinculados
    const unassigned = ATRIBUTOS_CONFIG.filter((a) => allocations[a.key] === null);
    if (unassigned.length > 0) {
      const names = unassigned.map((a) => a.label).join(', ');
      setErrorMessage(`Por favor, vincule valores para todos os atributos pendentes antes de salvar: ${names}.`);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nome: formData.nome.trim(),
        raca: formData.raca,
        classe: formData.classe,
        subclasse: formData.subclasse || 'Nenhuma',
        nivel: Number(formData.nivel) || 1,
        hp: Number(formData.hp) || 10,
        classeArmadura: Number(formData.classeArmadura) || 10,
        forca: getAttrValue('forca') || 10,
        destreza: getAttrValue('destreza') || 10,
        constituicao: getAttrValue('constituicao') || 10,
        inteligencia: getAttrValue('inteligencia') || 10,
        sabedoria: getAttrValue('sabedoria') || 10,
        carisma: getAttrValue('carisma') || 10,
        pericias: periciasSelecionadas,
        magias: magias,
      };

      const resultado = await dndService.criarPersonagem(payload);
      setSuccessMessage(`Ficha de ${resultado.nome} forjada com sucesso!`);
      setTimeout(() => {
        if (onSuccess) onSuccess(resultado);
      }, 1000);
    } catch (err) {
      setErrorMessage(err.message || 'Falha ao salvar a ficha de personagem.');
    } finally {
      setLoading(false);
    }
  };

  // 1. Card compacto para a Seção de Vínculo Rápido de Atributos
  const renderCompactAttributeCard = (atr) => {
    const currentPoolId = allocations[atr.key];
    const currentVal = getAttrValue(atr.key);
    const rawMod = getAttrRawMod(atr.key);
    const formattedMod = formatMod(rawMod);
    const isSelectedToBind = selectedPoolId !== null;
    const isAlreadyHere = selectedPoolId === currentPoolId;
    const selectedVal = pool.find((p) => p.id === selectedPoolId)?.val;
    const isFilled = currentVal !== null;

    return (
      <div key={atr.key} className="col-6 col-md-4 col-lg-2">
        <div
          className={`card bg-dark ${
            isSelectedToBind
              ? isAlreadyHere
                ? 'border-info shadow'
                : 'border-warning shadow-lg'
              : isFilled
              ? 'border-warning border-opacity-75'
              : 'border-secondary border-opacity-50'
          } p-2 h-100 text-center position-relative`}
          style={{
            cursor: isSelectedToBind ? 'pointer' : 'default',
            transition: 'all 0.2s ease',
            backgroundColor: isSelectedToBind && !isAlreadyHere
              ? 'rgba(212, 175, 55, 0.12)'
              : isFilled
              ? 'rgba(20, 25, 36, 0.95)'
              : 'rgba(15, 18, 26, 0.6)',
            borderStyle: isFilled ? 'solid' : 'dashed',
          }}
          onClick={() => {
            if (isSelectedToBind && !isAlreadyHere) {
              handleAssign(atr.key, selectedPoolId);
            }
          }}
          title={
            isSelectedToBind
              ? isAlreadyHere
                ? 'Dado já vinculado aqui'
                : `Clique para vincular ${selectedVal} a ${atr.label}`
              : isFilled
              ? `${atr.label}: ${currentVal}`
              : `${atr.label} (Pendente)`
          }
        >
          <span
            className="font-rpg text-gold fw-bold mb-1 d-block text-truncate"
            style={{ fontSize: '0.78rem', letterSpacing: '0.02em' }}
            title={atr.label}
          >
            <i className={`bi ${atr.icon} me-1`}></i>
            {atr.label}
          </span>

          {/* Valor Numérico ou Indicador Vazio */}
          <div className="my-1">
            {isFilled ? (
              <span className="h3 text-gold font-rpg fw-bold mb-0">{currentVal}</span>
            ) : (
              <span className="text-secondary font-rpg fw-light" style={{ fontSize: '1.6rem' }}>
                —
              </span>
            )}
          </div>

          <span
            className={`badge font-monospace mb-2 ${
              isFilled ? 'bg-secondary bg-opacity-25 text-info' : 'bg-dark text-muted border border-secondary border-opacity-25'
            }`}
            style={{ fontSize: '0.75rem' }}
          >
            {isFilled ? `Mod: ${formattedMod}` : 'Pendente'}
          </span>

          {/* Ações de Vínculo e Troca */}
          {isSelectedToBind ? (
            <div className="mt-auto">
              {isAlreadyHere ? (
                <span className="badge bg-info bg-opacity-25 text-info border border-info d-block py-1 font-rpg" style={{ fontSize: '0.72rem' }}>
                  <i className="bi bi-check2-circle me-1"></i> Vinculado
                </span>
              ) : (
                <button
                  type="button"
                  className="btn btn-sm btn-warning text-dark fw-bold w-100 font-rpg py-1 px-1 shadow-sm"
                  style={{ fontSize: '0.72rem' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAssign(atr.key, selectedPoolId);
                  }}
                >
                  <i className="bi bi-arrow-down-circle-fill me-1"></i> {isFilled ? `Trocar p/ ${selectedVal}` : `Vincular ${selectedVal}`}
                </button>
              )}
            </div>
          ) : (
            <div className="mt-auto" onClick={(e) => e.stopPropagation()}>
              <select
                className="form-select form-select-sm bg-dark text-light border-warning border-opacity-50 font-rpg text-center py-0"
                style={{ fontSize: '0.75rem' }}
                value={currentPoolId || ''}
                onChange={(e) => handleAssign(atr.key, e.target.value)}
              >
                <option value="">-- Selecionar --</option>
                {pool.map((item) => {
                  const holder = Object.keys(allocations).find(
                    (k) => allocations[k] === item.id && k !== atr.key
                  );
                  const holderAttr = ATRIBUTOS_CONFIG.find((a) => a.key === holder);

                  return (
                    <option key={item.id} value={item.id}>
                      {item.val} {holderAttr ? `(troca c/ ${holderAttr.short})` : '(Livre)'}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 2. Card estruturado para a Seção de Perícias e Salvaguardas (layout oficial da ficha D&D 5e/5.5e)
  const renderSkillsAttributeBlock = (atr) => {
    const currentVal = getAttrValue(atr.key);
    const rawMod = getAttrRawMod(atr.key);
    const formattedMod = formatMod(rawMod);
    const isSTProficient = salvaguardasSelecionadas.includes(atr.key);
    const isFilled = currentVal !== null;

    return (
      <div key={atr.key} className="card bg-dark border border-warning border-opacity-40 p-3 mb-3">
        <div className="d-flex justify-content-between align-items-center mb-2 pb-1 border-bottom border-warning border-opacity-25">
          <span className="font-rpg text-gold fw-bold" style={{ fontSize: '0.9rem' }}>
            <i className={`bi ${atr.icon} me-1 text-warning`}></i> {atr.label}
          </span>
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small font-rpg">
              Valor: <strong className={isFilled ? 'text-light' : 'text-warning'}>{isFilled ? currentVal : 'Pendente'}</strong>
            </span>
            <span className={`badge font-monospace ${isFilled ? 'bg-warning bg-opacity-20 text-gold border border-warning' : 'bg-dark text-muted'}`}>
              Mod: {formattedMod}
            </span>
          </div>
        </div>

        {/* Salvaguarda */}
        <div className="p-2 mb-2 rounded bg-black bg-opacity-40 border border-secondary border-opacity-25 d-flex align-items-center justify-content-between">
          <div className="form-check mb-0 d-flex align-items-center">
            <input
              className="form-check-input me-2"
              type="checkbox"
              id={`save-${atr.key}`}
              checked={isSTProficient}
              onChange={() => handleToggleSalvaguarda(atr.key)}
              style={{ cursor: 'pointer' }}
            />
            <label
              className="form-check-label font-rpg text-light fw-semibold"
              htmlFor={`save-${atr.key}`}
              style={{ fontSize: '0.82rem', cursor: 'pointer' }}
            >
              Salvaguarda
            </label>
          </div>
          <span
            className={`badge font-monospace ${
              isSTProficient && isFilled
                ? 'bg-warning bg-opacity-25 text-gold border border-warning'
                : 'bg-secondary bg-opacity-25 text-light'
            }`}
            style={{ minWidth: '42px', fontSize: '0.8rem' }}
          >
            {getSaveBonus(atr.key)}
          </span>
        </div>

        {/* Perícias vinculadas */}
        {atr.pericias.length > 0 ? (
          <div>
            <div className="d-flex flex-column gap-1">
              {atr.pericias.map((skillName) => {
                const isProf = periciasSelecionadas.includes(skillName);
                const skillMod = getSkillBonus(atr.key, skillName);

                return (
                  <div
                    key={skillName}
                    className={`p-1 px-2 rounded d-flex align-items-center justify-content-between ${
                      isProf ? 'bg-warning bg-opacity-10 border border-warning border-opacity-40' : 'bg-transparent'
                    }`}
                  >
                    <div className="form-check mb-0 d-flex align-items-center">
                      <input
                        className="form-check-input me-2"
                        type="checkbox"
                        id={`skill-${skillName}`}
                        checked={isProf}
                        onChange={() => handleTogglePericia(skillName)}
                        style={{ cursor: 'pointer' }}
                      />
                      <label
                        className={`form-check-label small font-rpg mb-0 ${isProf ? 'text-gold fw-bold' : 'text-light'}`}
                        htmlFor={`skill-${skillName}`}
                        style={{ fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        {skillName}
                      </label>
                    </div>

                    <span
                      className={`badge font-monospace ${
                        isProf && isFilled
                          ? 'bg-warning bg-opacity-25 text-gold border border-warning'
                          : 'bg-dark text-muted border border-secondary border-opacity-25'
                      }`}
                      style={{ minWidth: '38px', fontSize: '0.78rem' }}
                    >
                      {skillMod}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-1">
            <span className="text-muted font-rpg fst-italic" style={{ fontSize: '0.7rem' }}>
              (Sem perícias diretas associadas)
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="card rpg-card fade-in">
      <div className="card-header rpg-card-header d-flex justify-content-between align-items-center">
        <div>
          <h2 className="h4 font-rpg text-gold mb-0">
            <i className="bi bi-feather text-gold me-2"></i>Forjar Novo Personagem
          </h2>
          <small className="text-muted font-rpg">D&D 5e / 5.5e • Sistema Oficial de Fichas</small>
        </div>
        {onCancel && (
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onCancel}>
            <i className="bi bi-x-lg"></i>
          </button>
        )}
      </div>

      <div className="card-body p-4 rpg-form">
        {errorMessage && (
          <div className="alert rpg-alert-danger d-flex align-items-center mb-4 py-2 px-3">
            <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
            <div>{errorMessage}</div>
          </div>
        )}

        {infoMessage && (
          <div className="alert rpg-alert-success d-flex align-items-center mb-4 py-2 px-3">
            <i className="bi bi-info-circle-fill me-2 fs-5"></i>
            <div>{infoMessage}</div>
          </div>
        )}

        {successMessage && (
          <div className="alert rpg-alert-success d-flex align-items-center mb-4 py-2 px-3">
            <i className="bi bi-check-circle-fill me-2 fs-5"></i>
            <div>{successMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Seção 1: Informações Básicas */}
          <div className="mb-4">
            <h5 className="font-rpg text-gold mb-3 border-bottom border-warning border-opacity-25 pb-2">
              <i className="bi bi-person-lines-fill me-2"></i>1. Informações Básicas
            </h5>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="charNome">
                  <i className="bi bi-tag-fill"></i> Nome do Aventureiro
                </label>
                <input
                  type="text"
                  id="charNome"
                  name="nome"
                  className="form-control"
                  placeholder="Ex: Minsc, Legolas, Jester Lavorre"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="charSubclasse">
                  <i className="bi bi-stars"></i> Subclasse / Arquétipo
                </label>
                <input
                  type="text"
                  id="charSubclasse"
                  name="subclasse"
                  className="form-control"
                  placeholder="Ex: Caçador, Mestre de Batalha, Evocação"
                  value={formData.subclasse}
                  onChange={handleChange}
                />
              </div>

              <div className="col-4 col-md-4">
                <label className="form-label" htmlFor="charNivel">
                  <i className="bi bi-trophy"></i> Nível
                </label>
                <input
                  type="number"
                  id="charNivel"
                  name="nivel"
                  className="form-control text-center"
                  min="1"
                  max="20"
                  value={formData.nivel}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label text-crimson d-flex justify-content-between align-items-center mb-1" htmlFor="charHp">
                  <span>
                    <i className="bi bi-heart-fill me-1"></i> Pontos de Vida (PV)
                  </span>
                  <span
                    className="badge bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50 font-monospace"
                    style={{ fontSize: '0.72rem' }}
                    title="Fórmula Nível 1: Base da Classe + Modificador de CON"
                  >
                    Nvl 1: {getBaseHpForClass(formData.classe)} + CON
                  </span>
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    id="charHp"
                    name="hp"
                    className="form-control text-center fw-bold fs-5 text-danger bg-dark border-danger border-opacity-50"
                    min="1"
                    value={formData.hp}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    title="Recalcular PV pelas regras oficiais do Nível 1"
                    onClick={() => {
                      const base = getBaseHpForClass(formData.classe);
                      const modCon = getAttrRawMod('constituicao');
                      const totalHp = Math.max(1, base + (modCon !== null ? modCon : 0));
                      setFormData((prev) => ({ ...prev, hp: totalHp }));
                    }}
                  >
                    <i className="bi bi-arrow-clockwise"></i>
                  </button>
                </div>
                <small className="text-muted d-block mt-1 font-rpg" style={{ fontSize: '0.73rem' }}>
                  Base: <strong className="text-light">{getBaseHpForClass(formData.classe)}</strong> ({formData.classe}) | Mod CON:{' '}
                  <strong className={getAttrRawMod('constituicao') !== null ? 'text-gold' : 'text-warning'}>
                    {getAttrRawMod('constituicao') !== null
                      ? formatMod(getAttrRawMod('constituicao'))
                      : 'Pendente (0)'}
                  </strong>
                </small>
              </div>

              <div className="col-6 col-md-4">
                <label className="form-label text-arcane" htmlFor="charCA">
                  <i className="bi bi-shield-fill"></i> Classe Armadura (CA)
                </label>
                <input
                  type="number"
                  id="charCA"
                  name="classeArmadura"
                  className="form-control text-center fw-bold"
                  min="5"
                  value={formData.classeArmadura}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Seção 2: Raça & Classe */}
          <div className="mb-4">
            <h5 className="font-rpg text-gold mb-3 border-bottom border-warning border-opacity-25 pb-2">
              <i className="bi bi-book-half me-2"></i>2. Origem e Vocação
            </h5>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="charRaca">
                  <i className="bi bi-people-fill"></i> Raça
                </label>
                <select
                  id="charRaca"
                  name="raca"
                  className="form-control"
                  value={formData.raca}
                  onChange={handleChange}
                >
                  {RACAS_DND.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dropdown exclusivo com as 13 classes especificadas e indicativo de PV */}
              <div className="col-12 col-md-6">
                <label className="form-label d-flex justify-content-between align-items-center" htmlFor="charClasse">
                  <span>
                    <i className="bi bi-award-fill"></i> Classe
                  </span>
                  <span className="badge bg-danger bg-opacity-20 text-danger border border-danger border-opacity-40 font-monospace" style={{ fontSize: '0.72rem' }}>
                    {formData.classe}: {getBaseHpForClass(formData.classe)} PV base
                  </span>
                </label>
                <select
                  id="charClasse"
                  name="classe"
                  className="form-control"
                  value={formData.classe}
                  onChange={handleChange}
                >
                  {CLASSES_DND.map((classeNome) => (
                    <option key={classeNome} value={classeNome}>
                      {classeNome} ({HIT_POINTS_BASE_POR_CLASSE[classeNome] || 8} PV base)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Seção 3: Atributos Fundamentais (Rolagem & Vínculo Rápido no mesmo campo de visão) */}
          <div className="mb-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3 border-bottom border-warning border-opacity-25 pb-2">
              <div>
                <h5 className="font-rpg text-gold mb-1">
                  <i className="bi bi-dice-6-fill me-2"></i>3. Atributos Fundamentais (Rolagem & Vínculo)
                </h5>
                <small className="text-muted font-rpg">
                  Clique em um número do banco para vincular ao atributo desejado. Dados já vinculados mudam de cor!
                </small>
              </div>

              {/* Controles de Rolagem e Padrão */}
              <div className="d-flex flex-wrap align-items-center gap-2">
                <span className={`badge ${rerollsLeft > 0 ? 'bg-warning bg-opacity-25 text-gold border border-warning' : 'bg-secondary text-muted'} font-rpg py-2 px-3`}>
                  <i className="bi bi-arrow-repeat me-1"></i> Rerolagens: {rerollsLeft} / 3
                </span>

                <button
                  type="button"
                  className="btn btn-sm btn-dnd-outline d-flex align-items-center gap-1"
                  onClick={handleRolarAtributos}
                  disabled={rollingDice || rerollsLeft <= 0}
                  title={rerollsLeft <= 0 ? 'Limite de 3 rerolagens atingido' : 'Rolar novos atributos na APIdados'}
                >
                  {rollingDice ? (
                    <>
                      <span className="spinner-border spinner-border-sm"></span>
                      <span>Rolando na APIdados...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-dice-5-fill text-gold"></i>
                      <span>Rolar via APIdados</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1"
                  onClick={handleRestaurarPadrao}
                  title="Restaurar valores 15, 14, 13, 12, 10 e 8"
                >
                  <i className="bi bi-shield-check"></i>
                  <span>Array Padrão (15, 14, 13, 12, 10, 8)</span>
                </button>
              </div>
            </div>

            {/* Painel do Banco de Valores Rolados com Mudança Clara de Cores */}
            <div className="bg-dark p-3 rounded border border-warning border-opacity-50 mb-3">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-2">
                <span className="font-rpg text-gold small fw-bold">
                  <i className="bi bi-collection me-1"></i> Banco de Valores Rolados:
                </span>
                <div className="d-flex align-items-center gap-3" style={{ fontSize: '0.72rem' }}>
                  <span className="text-success"><i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i>Livre</span>
                  <span className="text-info"><i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i>Vinculado</span>
                  <span className="text-warning"><i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i>Selecionado</span>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2">
                {pool.map((item) => {
                  const assignedKey = Object.keys(allocations).find((k) => allocations[k] === item.id);
                  const assignedAttr = ATRIBUTOS_CONFIG.find((a) => a.key === assignedKey);
                  const isSelected = selectedPoolId === item.id;
                  const isAssigned = !!assignedAttr;

                  // Estilos diferenciados por estado
                  let buttonClass = 'btn btn-sm text-center px-3 py-2 ';
                  let valClass = 'h4 mb-0 font-rpg fw-bold ';

                  if (isSelected) {
                    buttonClass += 'btn-warning text-dark fw-bold border-light shadow-lg';
                    valClass += 'text-dark';
                  } else if (isAssigned) {
                    // Valor já selecionado muda de cor (Ciano Arcano)
                    buttonClass += 'bg-black border border-info border-opacity-75 text-info shadow-sm';
                    valClass += 'text-info';
                  } else {
                    // Valor livre (Dourado Nobre com borda suave)
                    buttonClass += 'bg-dark border border-warning border-opacity-75 text-light';
                    valClass += 'text-gold';
                  }

                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setSelectedPoolId(isSelected ? null : item.id)}
                      className={buttonClass}
                      style={{
                        minWidth: '85px',
                        transition: 'all 0.2s ease',
                        transform: isSelected ? 'scale(1.05)' : undefined,
                      }}
                    >
                      <div className={valClass}>{item.val}</div>
                      <div className="small font-monospace" style={{ fontSize: '0.7rem' }}>
                        {isSelected ? (
                          <span className="badge bg-dark text-warning">Selecionado</span>
                        ) : isAssigned ? (
                          <span className="badge bg-info bg-opacity-25 text-info fw-bold">
                            Em {assignedAttr.short}
                          </span>
                        ) : (
                          <span className="badge bg-success bg-opacity-25 text-success">
                            Livre
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedPoolId && (
                <div className="mt-3 p-2 bg-dark rounded border border-warning d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div className="text-warning small font-rpg">
                    <i className="bi bi-cursor-fill me-1"></i> Dado selecionado: <strong className="fs-6 text-gold bg-warning bg-opacity-25 px-2 py-1 rounded">{pool.find((p) => p.id === selectedPoolId)?.val}</strong>. Clique em qualquer um dos 6 atributos abaixo para vincular ou trocar!
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary py-0 px-2 font-rpg"
                    style={{ fontSize: '0.75rem' }}
                    onClick={() => setSelectedPoolId(null)}
                  >
                    <i className="bi bi-x-circle me-1"></i> Desmarcar
                  </button>
                </div>
              )}
            </div>

            {/* Grid dos 6 Atributos em Linha Horizontal (Compacto, mesmo campo de visão) */}
            <div className="row g-2">
              {ATRIBUTOS_CONFIG.map(renderCompactAttributeCard)}
            </div>
          </div>

          {/* Seção 4: Ficha Oficial de Perícias & Salvaguardas (Separada, estilo oficial D&D) */}
          <div className="mb-4">
            <div className="mb-3 border-bottom border-warning border-opacity-25 pb-2">
              <h5 className="font-rpg text-gold mb-1">
                <i className="bi bi-shield-check me-2"></i>4. Ficha de Perícias & Salvaguardas (Oficial D&D 5e / 5.5e)
              </h5>
              <small className="text-muted font-rpg">
                Calculadas automaticamente com base nos atributos definidos acima e no seu Bônus de Proficiência.
              </small>
            </div>

            {/* Layout em 2 Colunas idêntico à Ficha Oficial do D&D */}
            <div className="row g-4">
              {/* Coluna 1: Bônus de Proficiência + Força + Destreza + Constituição */}
              <div className="col-12 col-lg-6">
                {/* Banner de Bônus de Proficiência e Inspiração */}
                <div className="card bg-dark border border-warning border-opacity-50 p-3 mb-3">
                  <div className="row g-2 align-items-center text-center">
                    <div className="col-6 border-end border-warning border-opacity-25">
                      <span className="font-rpg text-gold small d-block mb-1">
                        <i className="bi bi-bookmark-star-fill me-1"></i> BÔNUS DE PROFICIÊNCIA
                      </span>
                      <span className="h3 text-warning font-rpg fw-bold mb-0">+{profBonus}</span>
                      <small className="text-muted d-block font-rpg" style={{ fontSize: '0.65rem' }}>
                        (Nível {formData.nivel})
                      </small>
                    </div>

                    <div className="col-6">
                      <span className="font-rpg text-gold small d-block mb-1">
                        <i className="bi bi-star-fill me-1"></i> INSPIRAÇÃO HEROICA
                      </span>
                      <div className="form-check form-switch d-inline-block mt-1">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="inspHeroicaSwitch"
                          checked={inspiracaoHeroica}
                          onChange={(e) => setInspiracaoHeroica(e.target.checked)}
                          style={{ cursor: 'pointer' }}
                        />
                        <label
                          className={`form-check-label font-rpg small ${inspiracaoHeroica ? 'text-warning fw-bold' : 'text-muted'}`}
                          htmlFor="inspHeroicaSwitch"
                        >
                          {inspiracaoHeroica ? 'Ativa' : 'Disponível'}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Força, Destreza, Constituição */}
                {ATRIBUTOS_CONFIG.filter((a) => a.col === 1).map(renderSkillsAttributeBlock)}
              </div>

              {/* Coluna 2: Inteligência + Sabedoria + Carisma */}
              <div className="col-12 col-lg-6">
                {ATRIBUTOS_CONFIG.filter((a) => a.col === 2).map(renderSkillsAttributeBlock)}
              </div>
            </div>
          </div>

          {/* Seção 5: Magias & Recursos da Classe */}
          <div className="mb-4">
            <h5 className="font-rpg text-gold mb-3 border-bottom border-warning border-opacity-25 pb-2">
              <i className="bi bi-journal-bookmark-fill me-2"></i>5. Magias, Truques & Anotações de Aventura
            </h5>
            <div className="row g-3">
              <div className="col-12">
                <textarea
                  id="charMagias"
                  className="form-control"
                  rows="4"
                  placeholder="Ex: Marca do Caçador, Rajada Mística, Curar Ferimentos, Mãos Flamejantes, Falar com Animais..."
                  value={magias}
                  onChange={(e) => setMagias(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="d-flex justify-content-end gap-3 pt-3 border-top border-secondary border-opacity-25">
            {onCancel && (
              <button
                type="button"
                className="btn btn-outline-secondary px-4 font-rpg"
                onClick={onCancel}
                disabled={loading}
              >
                Cancelar
              </button>
            )}

            <button
              type="submit"
              className="btn btn-dnd-crimson btn-lg px-4 d-flex align-items-center gap-2 font-rpg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                  <span>Registrando ficha no dndmanager...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-shield-plus fs-5"></i>
                  <span>Concluir e Salvar Personagem</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCharacterForm;
