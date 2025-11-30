import { Cliente } from '../models/index.js';

// Listar todos os clientes
export const listarClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      order: [['nome', 'ASC']]
    });

    res.json({
      success: true,
      data: clientes,
      total: clientes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao listar clientes',
      error: error.message
    });
  }
};

// Buscar cliente por ID
export const buscarCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const cliente = await Cliente.findByPk(id, {
      include: [{
        association: 'reservas',
        include: ['quarto']
      }]
    });

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    res.json({
      success: true,
      data: cliente
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar cliente',
      error: error.message
    });
  }
};

// Criar novo cliente
export const criarCliente = async (req, res) => {
  try {
    const { nome, cpf, email, telefone, endereco, dataNascimento } = req.body;

    const cliente = await Cliente.create({
      nome,
      cpf,
      email,
      telefone,
      endereco,
      dataNascimento
    });

    res.status(201).json({
      success: true,
      message: 'Cliente cadastrado com sucesso',
      data: cliente
    });
  } catch (error) {
    // Erro de validação do Sequelize
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        errors: error.errors.map(e => e.message)
      });
    }

    // Erro de unicidade (CPF duplicado)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'CPF já cadastrado'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao cadastrar cliente',
      error: error.message
    });
  }
};

// Atualizar cliente
export const atualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cpf, email, telefone, endereco, dataNascimento } = req.body;

    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    await cliente.update({
      nome,
      cpf,
      email,
      telefone,
      endereco,
      dataNascimento
    });

    res.json({
      success: true,
      message: 'Cliente atualizado com sucesso',
      data: cliente
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        errors: error.errors.map(e => e.message)
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'CPF já cadastrado'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar cliente',
      error: error.message
    });
  }
};

// Excluir cliente
export const excluirCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    await cliente.destroy();

    res.json({
      success: true,
      message: 'Cliente excluído com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao excluir cliente',
      error: error.message
    });
  }
};
