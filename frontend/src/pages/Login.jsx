import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const Login = ({ onNavigateToRegister, onLoginSuccess }) => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
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

    if (!formData.email.trim()) {
      setErrorMessage('Por favor, informe seu e-mail de aventureiro.');
      return;
    }

    if (!formData.senha) {
      setErrorMessage('Por favor, insira sua senha de acesso.');
      return;
    }

    try {
      const data = await login(formData.email.trim().toLowerCase(), formData.senha);
      setSuccessMessage('Acesso concedido! Entrando na Taverna...');
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(data);
        }
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || 'Falha ao autenticar. Verifique seus dados.');
    }
  };

  return (
    <div className="container py-5 fade-in">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5">
          <div className="card rpg-card">
            <div className="card-header rpg-card-header text-center">
              <div className="mb-2">
                <i className="bi bi-shield-lock-fill text-gold fs-1"></i>
              </div>
              <h2 className="h4 font-rpg text-gold mb-1">Acesso à Taverna</h2>
              <p className="text-muted small mb-0 font-rpg">
                Autentique-se para gerenciar suas fichas de D&D 5e/5.5e
              </p>
            </div>

            <div className="card-body p-4 rpg-form">
              {errorMessage && (
                <div className="alert rpg-alert-danger d-flex align-items-center mb-3 py-2 px-3" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
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
                {/* Campo E-mail */}
                <div className="mb-3">
                  <label htmlFor="emailInput" className="form-label">
                    <i className="bi bi-envelope-fill"></i> E-mail
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-at"></i>
                    </span>
                    <input
                      type="email"
                      id="emailInput"
                      name="email"
                      className="form-control"
                      placeholder="aragorn@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Campo Senha */}
                <div className="mb-4">
                  <label htmlFor="senhaInput" className="form-label">
                    <i className="bi bi-key-fill"></i> Senha Secreta
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock-fill"></i>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="senhaInput"
                      name="senha"
                      className="form-control"
                      placeholder="••••••••"
                      value={formData.senha}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary border-start-0"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                      title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} text-gold`}></i>
                    </button>
                  </div>
                </div>

                {/* Botão de Submissão */}
                <div className="d-grid mb-3">
                  <button
                    type="submit"
                    className="btn btn-dnd-gold btn-lg d-flex align-items-center justify-content-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span>Verificando credenciais...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right fs-5"></i>
                        <span>Entrar no Sistema</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="dnd-divider">
                <span>OU</span>
              </div>

              {/* Redirecionamento para Cadastro */}
              <div className="text-center">
                <p className="text-muted small mb-2">Ainda não possui registro de aventureiro?</p>
                <button
                  type="button"
                  className="btn btn-sm btn-dnd-outline w-100 py-2"
                  onClick={onNavigateToRegister}
                  disabled={loading}
                >
                  <i className="bi bi-feather me-1"></i> Criar Nova Conta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
