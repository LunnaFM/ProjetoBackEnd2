import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { clienteService } from '../services/clienteService';
import './Pages.css';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    endereco: '',
    dataNascimento: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      const response = await clienteService.listar();
      setClientes(response.data);
    } catch (error) {
      setError('Erro ao carregar clientes');
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
        await clienteService.atualizar(editando, formData);
        setSuccess('Cliente atualizado com sucesso!');
      } else {
        await clienteService.criar(formData);
        setSuccess('Cliente cadastrado com sucesso!');
      }
      resetForm();
      carregarClientes();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar cliente');
    }
  };

  const handleEdit = (cliente) => {
    setEditando(cliente.id);
    setFormData({
      nome: cliente.nome,
      cpf: cliente.cpf,
      email: cliente.email,
      telefone: cliente.telefone,
      endereco: cliente.endereco || '',
      dataNascimento: cliente.dataNascimento || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await clienteService.excluir(id);
        setSuccess('Cliente excluído com sucesso!');
        carregarClientes();
      } catch (err) {
        setError('Erro ao excluir cliente');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      cpf: '',
      email: '',
      telefone: '',
      endereco: '',
      dataNascimento: ''
    });
    setEditando(null);
    setShowForm(false);
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
          <h1>Gerenciamento de Clientes</h1>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancelar' : '+ Novo Cliente'}
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {showForm && (
          <div className="form-card">
            <h2>{editando ? 'Editar Cliente' : 'Novo Cliente'}</h2>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nome Completo *</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CPF *</label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Telefone *</label>
                  <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Endereço</label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Data de Nascimento</label>
                  <input
                    type="date"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                  />
                </div>
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
          <h2>Lista de Clientes ({clientes.length})</h2>
          {clientes.length === 0 ? (
            <p className="empty-state">Nenhum cliente cadastrado</p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>{cliente.nome}</td>
                      <td>{cliente.cpf}</td>
                      <td>{cliente.email}</td>
                      <td>{cliente.telefone}</td>
                      <td className="actions">
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => handleEdit(cliente)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => handleDelete(cliente.id)}
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

export default Clientes;
