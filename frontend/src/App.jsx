import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { useAuth } from './context/AuthContext';

export const App = () => {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState(isAuthenticated ? 'dashboard' : 'login');

  useEffect(() => {
    if (isAuthenticated) {
      setCurrentView('dashboard');
    } else if (currentView === 'dashboard') {
      setCurrentView('login');
    }
  }, [isAuthenticated]);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Barra de Navegação Superior */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
      />

      {/* Conteúdo Principal */}
      <main className="flex-grow-1 d-flex flex-column justify-content-center">
        {currentView === 'login' && (
          <Login
            onNavigateToRegister={() => setCurrentView('register')}
            onLoginSuccess={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'register' && (
          <Register
            onNavigateToLogin={() => setCurrentView('login')}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            onNavigateToCharacterCreation={() => setCurrentView('character-creation')}
          />
        )}
      </main>

      {/* Rodapé Temático */}
      <footer className="py-4 text-center text-muted border-top border-secondary border-opacity-25 mt-auto">
        <div className="container">
          <p className="mb-1 small font-rpg text-gold">
            <i className="bi bi-dice-20-fill me-1"></i> DnD Hub • Gerenciador de Aventuras D&D 5e / 5.5e
          </p>
          <p className="mb-0 text-secondary" style={{ fontSize: '0.78rem' }}>
            Frontend React + Bootstrap • dndmanager (:8080) & APIdados (:8081) • Autenticação JWT
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
