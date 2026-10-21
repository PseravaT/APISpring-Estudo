import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const Register = ({ onNavigateToLogin }) => {
  const { cadastrar, loading } = useAuth();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.nome.trim()) {
      setErrorMessage('Por favor, informe seu nome de aventureiro.');
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage('Formato de e-mail inválido. Exemplo: guerreiro@taverna.com');
      return;
    }

    if (!formData.senha || formData.senha.length < 6) {
      setErrorMessage('A senha deve possuir ao menos 6 caracteres.');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setErrorMessage('As senhas digitadas não coincidem.');
      return;
    }

    try {
      await cadastrar(formData.nome.trim(), formData.email.trim().toLowerCase(), formData.senha);
      setSuccessMessage('Registro forjado com sucesso! Redirecionando para o login...');
      setTimeout(() => {
        if (onNavigateToLogin) {
          onNavigateToLogin();
        }
      }, 1500);
    } catch (err) {
      setErrorMessage(err.message || 'Falha ao realizar o cadastro.');
    }
  };

  return (
    <div className="container py-5 fade-in">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6">
          <div className="card rpg-card">
            <div className="card-header rpg-card-header text-center">
              <div className="mb-2">
                <i className="bi bi-feather text-gold fs-1"></i>
              </div>
              <h2 className="h4 font-rpg text-gold mb-1">Registro de Aventureiro</h2>
              <p className="text-muted small mb-0 font-rpg">
                Escreva seu nome no Livro dos Heróis para iniciar suas jornadas
              </p>
            </div>

            <div className="card-body p-4 rpg-form">
              {errorMessage && (
                <div className="alert rpg-alert-danger d-flex align-items-center mb-3 py-2 px-3" role="alert">
                  <i className="bi bi-shield-x me-2 fs-5"></i>
                  <div className="small">{errorMessage}</div>
                </div>
              )}

              {successMessage && (
                <div className="alert rpg-alert-success d-flex align-items-center mb-3 py-2 px-3" role="alert">
                  <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                  <div className="small">{successMessage}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Nome do Aventureiro */}
                <div className="mb-3">
                  <label htmlFor="nomeInput" className="form-label">
                    <i className="bi bi-person-badge"></i> Nome do Aventureiro
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      id="nomeInput"
                      name="nome"
                      className="form-control"
                      placeholder="Ex: Aragorn, Valeros, Jester"
                      value={formData.nome}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                {/* E-mail */}
                <div className="mb-3">
                  <label htmlFor="registerEmailInput" className="form-label">
                    <i className="bi bi-envelope-fill"></i> E-mail de Contato
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-at"></i>
                    </span>
                    <input
                      type="email"
                      id="registerEmailInput"
                      name="email"
                      className="form-control"
                      placeholder="aventureiro@dnd.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Senha */}
                <div className="row g-2 mb-4">
                  <div className="col-12 col-md-6">
                    <label htmlFor="registerSenhaInput" className="form-label">
                      <i className="bi bi-key-fill"></i> Senha
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="registerSenhaInput"
                        name="senha"
                        className="form-control"
                        placeholder="Mínimo 6 dígitos"
                        value={formData.senha}
                        onChange={handleChange}
                        disabled={loading}
                        required
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex="-1"
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} text-gold`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="confirmarSenhaInput" className="form-label">
                      <i className="bi bi-check2-circle"></i> Confirmar Senha
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="confirmarSenhaInput"
                        name="confirmarSenha"
                        className="form-control"
                        placeholder="Repita a senha"
                        value={formData.confirmarSenha}
                        onChange={handleChange}
                        disabled={loading}
                        required
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                </div>

                {/* Botão de Registro */}
                <div className="d-grid mb-3">
                  <button
                    type="submit"
                    className="btn btn-dnd-crimson btn-lg d-flex align-items-center justify-content-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span>Forjando credencial...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-shield-plus fs-5"></i>
                        <span>Concluir Cadastro</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="dnd-divider">
                <span>OU</span>
              </div>

              {/* Redirecionamento para Login */}
              <div className="text-center">
                <p className="text-muted small mb-2">Já possui cadastro na Taverna?</p>
                <button
                  type="button"
                  className="btn btn-sm btn-dnd-outline w-100 py-2"
                  onClick={onNavigateToLogin}
                  disabled={loading}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i> Acessar com Conta Existente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
