import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { quartoService } from '../services/quartoService';
import './Pages.css';

const Quartos = () => {
  const [quartos, setQuartos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    numero: '',
    tipo: 'solteiro',
    capacidade: 1,
    valorDiaria: '',
    status: 'disponivel',
    descricao: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    carregarQuartos();
  }, []);

  const carregarQuartos = async () => {
    try {
      const response = await quartoService.listar();
      setQuartos(response.data);
    } catch (error) {
      setError('Erro ao carregar quartos');
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
        await quartoService.atualizar(editando, formData);
        setSuccess('Quarto atualizado com sucesso!');
      } else {
        await quartoService.criar(formData);
        setSuccess('Quarto cadastrado com sucesso!');
      }
      resetForm();
      carregarQuartos();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar quarto');
    }
  };

  const handleEdit = (quarto) => {
    setEditando(quarto.id);
    setFormData({
      numero: quarto.numero,
      tipo: quarto.tipo,
      capacidade: quarto.capacidade,
      valorDiaria: quarto.valorDiaria,
      status: quarto.status,
      descricao: quarto.descricao || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este quarto?')) {
      try {
        await quartoService.excluir(id);
        setSuccess('Quarto excluído com sucesso!');
        carregarQuartos();
      } catch (err) {
        setError('Erro ao excluir quarto');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      numero: '',
      tipo: 'solteiro',
      capacidade: 1,
      valorDiaria: '',
      status: 'disponivel',
      descricao: ''
    });
    setEditando(null);
    setShowForm(false);
  };

  const getStatusBadge = (status) => {
    const badges = {
      disponivel: 'badge-success',
      ocupado: 'badge-danger',
      manutencao: 'badge-warning'
    };
    return badges[status] || 'badge-secondary';
  };

  const getTipoIcon = (tipo) => {
    const icons = {
      solteiro: '🛏️',
      casal: '🛏️🛏️',
      luxo: '✨',
      suite: '👑'
    };
    return icons[tipo] || '🏨';
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
          <h1>Gerenciamento de Quartos</h1>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancelar' : '+ Novo Quarto'}
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {showForm && (
          <div className="form-card">
            <h2>{editando ? 'Editar Quarto' : 'Novo Quarto'}</h2>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-row">
                <div className="form-group">
                  <label>Número do Quarto *</label>
                  <input
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    placeholder="Ex: 101"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tipo *</label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    required
                  >
                    <option value="solteiro">Solteiro</option>
                    <option value="casal">Casal</option>
                    <option value="luxo">Luxo</option>
                    <option value="suite">Suíte</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Capacidade *</label>
                  <input
                    type="number"
                    name="capacidade"
                    value={formData.capacidade}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Valor da Diária (R$) *</label>
                  <input
                    type="number"
                    name="valorDiaria"
                    value={formData.valorDiaria}
                    onChange={handleChange}
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
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
                    <option value="disponivel">Disponível</option>
                    <option value="ocupado">Ocupado</option>
                    <option value="manutencao">Manutenção</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Descrição do quarto..."
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editando ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="table-card">
          <h2>Lista de Quartos ({quartos.length})</h2>
          {quartos.length === 0 ? (
            <p className="empty-state">Nenhum quarto cadastrado</p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Número</th>
                    <th>Tipo</th>
                    <th>Capacidade</th>
                    <th>Valor Diária</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {quartos.map((quarto) => (
                    <tr key={quarto.id}>
                      <td>
                        <strong>{quarto.numero}</strong>
                      </td>
                      <td>
                        {getTipoIcon(quarto.tipo)} {quarto.tipo}
                      </td>
                      <td>{quarto.capacidade} pessoa(s)</td>
                      <td>R$ {parseFloat(quarto.valorDiaria).toFixed(2)}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(quarto.status)}`}>
                          {quarto.status}
                        </span>
                      </td>
                      <td className="actions">
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => handleEdit(quarto)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => handleDelete(quarto.id)}
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

export default Quartos;
