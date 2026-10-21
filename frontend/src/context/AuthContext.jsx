import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../api/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => authService.getToken());
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState(null);

  useEffect(() => {
    // Escuta evento customizado de sessão expirada ou não autorizada
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('dnd:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('dnd:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (email, senha) => {
    setLoading(true);
    try {
      const data = await authService.login(email, senha);
      setToken(data.token);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const cadastrar = async (nome, email, senha) => {
    setLoading(true);
    try {
      const data = await authService.cadastrar(nome, email, senha);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    setAuthMessage(null);
  };

  const testarConexaoTaverna = async () => {
    try {
      const msg = await authService.testarAutenticacao();
      setAuthMessage(msg);
      return msg;
    } catch (err) {
      setAuthMessage(null);
      throw err;
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    authMessage,
    login,
    cadastrar,
    logout,
    testarConexaoTaverna,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};

export default AuthContext;
