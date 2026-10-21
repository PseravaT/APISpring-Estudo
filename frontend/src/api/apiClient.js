import axios from 'axios';

const TOKEN_STORAGE_KEY = 'dnd_auth_token';
const USER_STORAGE_KEY = 'dnd_auth_user';

export const getStoredToken = () => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Erro ao ler usuário salvo no localStorage:', err);
    return null;
  }
};

export const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
};

export const removeStoredAuth = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
};

// Instância para a API dndmanager (gerenciamento, auth e fichas)
export const dndManagerApi = axios.create({
  baseURL: import.meta.env.VITE_DNDMANAGER_API_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Instância para a APIdados (rolagens de dados e cálculos de RPG)
export const dadosApi = axios.create({
  baseURL: import.meta.env.VITE_APIDADOS_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor comum para adicionar o Token JWT em cabeçalho Authorization
const attachAuthInterceptor = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = getStoredToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Se a API retornar 401 Não Autorizado, limpa dados se necessário
      if (error.response && error.response.status === 401) {
        // Disparar evento para a aplicação tratar redirecionamento se expirado
        window.dispatchEvent(new CustomEvent('dnd:unauthorized'));
      }
      return Promise.reject(error);
    }
  );
};

attachAuthInterceptor(dndManagerApi);
attachAuthInterceptor(dadosApi);

export default dndManagerApi;
