import api from './api';

export const authService = {
  // Registrar novo usuário
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Fazer login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obter usuário logado
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Verificar se está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Obter usuário do localStorage
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
