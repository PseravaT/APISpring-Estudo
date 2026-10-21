import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ currentView, onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg rpg-navbar py-3 sticky-top">
      <div className="container">
        <a
          href="#home"
          className="navbar-brand d-flex align-items-center gap-2 rpg-brand"
          onClick={(e) => {
            e.preventDefault();
            onNavigate(isAuthenticated ? 'dashboard' : 'login');
          }}
        >
          <i className="bi bi-shield-shaded text-gold fs-3"></i>
          <span>DnD Hub</span>
          <span className="badge bg-dark border border-warning text-gold fs-6 ms-2 font-rpg">
            5e / 5.5e
          </span>
        </a>

        <div className="d-flex align-items-center gap-3">
          {isAuthenticated ? (
            <div className="d-flex align-items-center gap-3">
              <span className="text-secondary d-none d-md-inline font-rpg">
                Aventureiro: <strong className="text-gold">{user?.email || 'Autenticado'}</strong>
              </span>

              <button
                type="button"
                className={`btn btn-sm ${currentView === 'dashboard' ? 'btn-dnd-gold' : 'btn-dnd-outline'}`}
                onClick={() => onNavigate('dashboard')}
              >
                <i className="bi bi-compass me-1"></i> Taverna
              </button>

              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => {
                  logout();
                  onNavigate('login');
                }}
                title="Encerrar sessão"
              >
                <i className="bi bi-box-arrow-right me-1"></i> Sair
              </button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className={`btn btn-sm ${currentView === 'login' ? 'btn-dnd-gold' : 'btn-dnd-outline'}`}
                onClick={() => onNavigate('login')}
              >
                <i className="bi bi-door-open me-1"></i> Entrar
              </button>

              <button
                type="button"
                className={`btn btn-sm ${currentView === 'register' ? 'btn-dnd-crimson' : 'btn-dnd-outline'}`}
                onClick={() => onNavigate('register')}
              >
                <i className="bi bi-person-plus me-1"></i> Cadastrar
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
