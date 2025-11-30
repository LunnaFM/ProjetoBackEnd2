import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { reservaService } from '../services/reservaService';
import { clienteService } from '../services/clienteService';
import { quartoService } from '../services/quartoService';
import './Pages.css';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [quartos, setQuartos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    clienteId: '',
    quartoId: '',
    dataCheckIn: '',
    dataCheckOut: '',
    status: 'pendente',
    observacoes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resReservas, resClientes, resQuartos] = await Promise.all([
        reservaService.listar(),
        clienteService.listar(),
        quartoService.listar()
      ]);
      setReservas(resReservas.data);
      setClientes(resClientes.data);
      setQuartos(resQuartos.data);
    } catch (error) {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editando) {
        await reservaService.atualizar(editando, formData);
        setSuccess('Reserva atualizada com sucesso!');
      } else {
        await reservaService.criar(formData);
        setSuccess('Reserva criada com sucesso!');
      }
      resetForm();
      carregarDados();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar reserva');
    }
  };

  const handleEdit = (reserva) => {
    setEditando(reserva.id);
    setFormData({
      clienteId: reserva.clienteId,
      quartoId: reserva.quartoId,
      dataCheckIn: reserva.dataCheckIn,
      dataCheckOut: reserva.dataCheckOut,
      status: reserva.status,
      observacoes: reserva.observacoes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta reserva?')) {
      try {
        await reservaService.excluir(id);
        setSuccess('Reserva excluída com sucesso!');
        carregarDados();
      } catch (err) {
        setError('Erro ao excluir reserva');
      }
    }
  };

  const handleCancelar = async (id) => {
    if (window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      try {
        await reservaService.cancelar(id);
        setSuccess('Reserva cancelada com sucesso!');
        carregarDados();
      } catch (err) {
        setError('Erro ao cancelar reserva');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      clienteId: '',
      quartoId: '',
      dataCheckIn: '',
      dataCheckOut: '',
      status: 'pendente',
      observacoes: ''
    });
    setEditando(null);
    setShowForm(false);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pendente: 'badge-warning',
      confirmada: 'badge-success',
      cancelada: 'badge-danger',
      finalizada: 'badge-secondary'
    };
    return badges[status] || 'badge-secondary';
  };

  const formatDate = (date) => {
    return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Carregando...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1>Gerenciamento de Reservas</h1>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancelar' : '+ Nova Reserva'}
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {showForm && (
          <div className="form-card">
            <h2>{editando ? 'Editar Reserva' : 'Nova Reserva'}</h2>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-row">
                <div className="form-group">
                  <label>Cliente *</label>
                  <select
                    name="clienteId"
                    value={formData.clienteId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione um cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nome} - {cliente.cpf}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Quarto *</label>
                  <select
                    name="quartoId"
                    value={formData.quartoId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione um quarto</option>
                    {quartos.map((quarto) => (
                      <option key={quarto.id} value={quarto.id}>
                        Quarto {quarto.numero} - {quarto.tipo} (R${' '}
                        {parseFloat(quarto.valorDiaria).toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Data Check-in *</label>
                  <input
                    type="date"
                    name="dataCheckIn"
                    value={formData.dataCheckIn}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Data Check-out *</label>
                  <input
                    type="date"
                    name="dataCheckOut"
                    value={formData.dataCheckOut}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="pendente">Pendente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="cancelada">Cancelada</option>
                    <option value="finalizada">Finalizada</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Observações</label>
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  placeholder="Observações sobre a reserva..."
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editando ? 'Atualizar' : 'Criar Reserva'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="table-card">
          <h2>Lista de Reservas ({reservas.length})</h2>
          {reservas.length === 0 ? (
            <p className="empty-state">Nenhuma reserva cadastrada</p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Quarto</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Dias</th>
                    <th>Valor Total</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map((reserva) => (
                    <tr key={reserva.id}>
                      <td>{reserva.cliente?.nome}</td>
                      <td>Quarto {reserva.quarto?.numero}</td>
                      <td>{formatDate(reserva.dataCheckIn)}</td>
                      <td>{formatDate(reserva.dataCheckOut)}</td>
                      <td>{reserva.numeroDias}</td>
                      <td>R$ {parseFloat(reserva.valorTotal).toFixed(2)}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(reserva.status)}`}>
                          {reserva.status}
                        </span>
                      </td>
                      <td className="actions">
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => handleEdit(reserva)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        {reserva.status !== 'cancelada' && (
                          <button
                            className="btn-icon btn-cancel"
                            onClick={() => handleCancelar(reserva.id)}
                            title="Cancelar"
                          >
                            ❌
                          </button>
                        )}
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => handleDelete(reserva.id)}
                          title="Excluir"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Reservas;
