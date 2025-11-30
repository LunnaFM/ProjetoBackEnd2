import api from './api';

export const clienteService = {
  // Listar todos os clientes
  listar: async () => {
    const response = await api.get('/clientes');
    return response.data;
  },

  // Buscar cliente por ID
  buscar: async (id) => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  // Criar novo cliente
  criar: async (clienteData) => {
    const response = await api.post('/clientes', clienteData);
    return response.data;
  },

  // Atualizar cliente
  atualizar: async (id, clienteData) => {
    const response = await api.put(`/clientes/${id}`, clienteData);
    return response.data;
  },

  // Excluir cliente
  excluir: async (id) => {
    const response = await api.delete(`/clientes/${id}`);
    return response.data;
  }
};
