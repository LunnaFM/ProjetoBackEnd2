import api from './api';

export const reservaService = {
  // Listar todas as reservas
  listar: async (filtros = {}) => {
    const params = new URLSearchParams(filtros);
    const response = await api.get(`/reservas?${params}`);
    return response.data;
  },

  // Buscar reserva por ID
  buscar: async (id) => {
    const response = await api.get(`/reservas/${id}`);
    return response.data;
  },

  // Criar nova reserva
  criar: async (reservaData) => {
    const response = await api.post('/reservas', reservaData);
    return response.data;
  },

  // Atualizar reserva
  atualizar: async (id, reservaData) => {
    const response = await api.put(`/reservas/${id}`, reservaData);
    return response.data;
  },

  // Cancelar reserva
  cancelar: async (id) => {
    const response = await api.patch(`/reservas/${id}/cancelar`);
    return response.data;
  },

  // Excluir reserva
  excluir: async (id) => {
    const response = await api.delete(`/reservas/${id}`);
    return response.data;
  }
};
