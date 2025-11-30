import { Quarto } from '../models/index.js';

// Listar todos os quartos
export const listarQuartos = async (req, res) => {
  try {
    const { status, tipo } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (tipo) where.tipo = tipo;

    const quartos = await Quarto.findAll({
      where,
      order: [['numero', 'ASC']]
    });

    res.json({
      success: true,
      data: quartos,
      total: quartos.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao listar quartos',
      error: error.message
    });
  }
};

// Buscar quarto por ID
export const buscarQuarto = async (req, res) => {
  try {
    const { id } = req.params;

    const quarto = await Quarto.findByPk(id, {
      include: [{
        association: 'reservas',
        include: ['cliente']
      }]
    });

    if (!quarto) {
      return res.status(404).json({
        success: false,
        message: 'Quarto não encontrado'
      });
    }

    res.json({
      success: true,
      data: quarto
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar quarto',
      error: error.message
    });
  }
};

// Criar novo quarto
export const criarQuarto = async (req, res) => {
  try {
    const { numero, tipo, capacidade, valorDiaria, status, descricao } = req.body;

    const quarto = await Quarto.create({
      numero,
      tipo,
      capacidade,
      valorDiaria,
      status: status || 'disponivel',
      descricao
    });

    res.status(201).json({
      success: true,
      message: 'Quarto cadastrado com sucesso',
      data: quarto
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
        message: 'Número do quarto já cadastrado'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao cadastrar quarto',
      error: error.message
    });
  }
};

// Atualizar quarto
export const atualizarQuarto = async (req, res) => {
  try {
    const { id } = req.params;
    const { numero, tipo, capacidade, valorDiaria, status, descricao } = req.body;

    const quarto = await Quarto.findByPk(id);

    if (!quarto) {
      return res.status(404).json({
        success: false,
        message: 'Quarto não encontrado'
      });
    }

    await quarto.update({
      numero,
      tipo,
      capacidade,
      valorDiaria,
      status,
      descricao
    });

    res.json({
      success: true,
      message: 'Quarto atualizado com sucesso',
      data: quarto
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
        message: 'Número do quarto já cadastrado'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar quarto',
      error: error.message
    });
  }
};

// Excluir quarto
export const excluirQuarto = async (req, res) => {
  try {
    const { id } = req.params;

    const quarto = await Quarto.findByPk(id);

    if (!quarto) {
      return res.status(404).json({
        success: false,
        message: 'Quarto não encontrado'
      });
    }

    await quarto.destroy();

    res.json({
      success: true,
      message: 'Quarto excluído com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao excluir quarto',
      error: error.message
    });
  }
};

// Listar quartos disponíveis
export const listarQuartosDisponiveis = async (req, res) => {
  try {
    const quartos = await Quarto.findAll({
      where: { status: 'disponivel' },
      order: [['numero', 'ASC']]
    });

    res.json({
      success: true,
      data: quartos,
      total: quartos.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao listar quartos disponíveis',
      error: error.message
    });
  }
};
