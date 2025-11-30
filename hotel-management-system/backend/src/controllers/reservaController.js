import { Reserva, Cliente, Quarto } from '../models/index.js';
import { Op } from 'sequelize';

// Listar todas as reservas
export const listarReservas = async (req, res) => {
  try {
    const { status } = req.query;
    
    const where = {};
    if (status) where.status = status;

    const reservas = await Reserva.findAll({
      where,
      include: [
        { association: 'cliente', attributes: ['id', 'nome', 'email', 'cpf'] },
        { association: 'quarto', attributes: ['id', 'numero', 'tipo', 'valorDiaria'] }
      ],
      order: [['dataCheckIn', 'DESC']]
    });

    res.json({
      success: true,
      data: reservas,
      total: reservas.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao listar reservas',
      error: error.message
    });
  }
};

// Buscar reserva por ID
export const buscarReserva = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await Reserva.findByPk(id, {
      include: [
        { association: 'cliente' },
        { association: 'quarto' }
      ]
    });

    if (!reserva) {
      return res.status(404).json({
        success: false,
        message: 'Reserva não encontrada'
      });
    }

    res.json({
      success: true,
      data: reserva
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar reserva',
      error: error.message
    });
  }
};

// Verificar disponibilidade do quarto
const verificarDisponibilidade = async (quartoId, dataCheckIn, dataCheckOut, reservaId = null) => {
  const where = {
    quartoId,
    status: { [Op.notIn]: ['cancelada'] },
    [Op.or]: [
      {
        dataCheckIn: { [Op.between]: [dataCheckIn, dataCheckOut] }
      },
      {
        dataCheckOut: { [Op.between]: [dataCheckIn, dataCheckOut] }
      },
      {
        [Op.and]: [
          { dataCheckIn: { [Op.lte]: dataCheckIn } },
          { dataCheckOut: { [Op.gte]: dataCheckOut } }
        ]
      }
    ]
  };

  // Se for atualização, excluir a própria reserva da verificação
  if (reservaId) {
    where.id = { [Op.ne]: reservaId };
  }

  const reservasConflitantes = await Reserva.findAll({ where });
  return reservasConflitantes.length === 0;
};

// Criar nova reserva
export const criarReserva = async (req, res) => {
  try {
    const { clienteId, quartoId, dataCheckIn, dataCheckOut, observacoes } = req.body;

    // Verificar se cliente existe
    const cliente = await Cliente.findByPk(clienteId);
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    // Verificar se quarto existe
    const quarto = await Quarto.findByPk(quartoId);
    if (!quarto) {
      return res.status(404).json({
        success: false,
        message: 'Quarto não encontrado'
      });
    }

    // Verificar disponibilidade do quarto
    const disponivel = await verificarDisponibilidade(quartoId, dataCheckIn, dataCheckOut);
    if (!disponivel) {
      return res.status(400).json({
        success: false,
        message: 'Quarto não disponível para o período selecionado'
      });
    }

    // Calcular número de dias
    const checkIn = new Date(dataCheckIn);
    const checkOut = new Date(dataCheckOut);
    const diffTime = Math.abs(checkOut - checkIn);
    const numeroDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Calcular valor total
    const valorTotal = numeroDias * parseFloat(quarto.valorDiaria);

    // Criar reserva
    const reserva = await Reserva.create({
      clienteId,
      quartoId,
      dataCheckIn,
      dataCheckOut,
      numeroDias,
      valorTotal,
      status: 'pendente',
      observacoes
    });

    // Buscar reserva com relacionamentos
    const reservaCompleta = await Reserva.findByPk(reserva.id, {
      include: [
        { association: 'cliente' },
        { association: 'quarto' }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Reserva criada com sucesso',
      data: reservaCompleta
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        errors: error.errors.map(e => e.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao criar reserva',
      error: error.message
    });
  }
};

// Atualizar reserva
export const atualizarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const { clienteId, quartoId, dataCheckIn, dataCheckOut, status, observacoes } = req.body;

    const reserva = await Reserva.findByPk(id);

    if (!reserva) {
      return res.status(404).json({
        success: false,
        message: 'Reserva não encontrada'
      });
    }

    // Se mudar o quarto ou as datas, verificar disponibilidade
    if (quartoId !== reserva.quartoId || dataCheckIn !== reserva.dataCheckIn || dataCheckOut !== reserva.dataCheckOut) {
      const disponivel = await verificarDisponibilidade(quartoId, dataCheckIn, dataCheckOut, id);
      if (!disponivel) {
        return res.status(400).json({
          success: false,
          message: 'Quarto não disponível para o período selecionado'
        });
      }
    }

    // Buscar quarto para recalcular valor
    const quarto = await Quarto.findByPk(quartoId);
    if (!quarto) {
      return res.status(404).json({
        success: false,
        message: 'Quarto não encontrado'
      });
    }

    // Calcular número de dias
    const checkIn = new Date(dataCheckIn);
    const checkOut = new Date(dataCheckOut);
    const diffTime = Math.abs(checkOut - checkIn);
    const numeroDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Calcular valor total
    const valorTotal = numeroDias * parseFloat(quarto.valorDiaria);

    await reserva.update({
      clienteId,
      quartoId,
      dataCheckIn,
      dataCheckOut,
      numeroDias,
      valorTotal,
      status,
      observacoes
    });

    // Buscar reserva atualizada com relacionamentos
    const reservaAtualizada = await Reserva.findByPk(id, {
      include: [
        { association: 'cliente' },
        { association: 'quarto' }
      ]
    });

    res.json({
      success: true,
      message: 'Reserva atualizada com sucesso',
      data: reservaAtualizada
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        errors: error.errors.map(e => e.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar reserva',
      error: error.message
    });
  }
};

// Excluir reserva
export const excluirReserva = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await Reserva.findByPk(id);

    if (!reserva) {
      return res.status(404).json({
        success: false,
        message: 'Reserva não encontrada'
      });
    }

    await reserva.destroy();

    res.json({
      success: true,
      message: 'Reserva excluída com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao excluir reserva',
      error: error.message
    });
  }
};

// Cancelar reserva
export const cancelarReserva = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await Reserva.findByPk(id);

    if (!reserva) {
      return res.status(404).json({
        success: false,
        message: 'Reserva não encontrada'
      });
    }

    await reserva.update({ status: 'cancelada' });

    res.json({
      success: true,
      message: 'Reserva cancelada com sucesso',
      data: reserva
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao cancelar reserva',
      error: error.message
    });
  }
};
