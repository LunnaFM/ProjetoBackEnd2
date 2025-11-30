import api from './api';

export const quartoService = {
  // Listar todos os quartos
  listar: async (filtros = {}) => {
    const params = new URLSearchParams(filtros);
    const response = await api.get(`/quartos?${params}`);
    return response.data;
  },

  // Listar quartos disponíveis
  listarDisponiveis: async () => {
    const response = await api.get('/quartos/disponiveis');
    return response.data;
  },

  // Buscar quarto por ID
  buscar: async (id) => {
    const response = await api.get(`/quartos/${id}`);
    return response.data;
  },

  // Criar novo quarto
  criar: async (quartoData) => {
    const response = await api.post('/quartos', quartoData);
    return response.data;
  },

  // Atualizar quarto
  atualizar: async (id, quartoData) => {
    const response = await api.put(`/quartos/${id}`, quartoData);
    return response.data;
  },

  // Excluir quarto
  excluir: async (id) => {
    const response = await api.delete(`/quartos/${id}`);
    return response.data;
  }
};
