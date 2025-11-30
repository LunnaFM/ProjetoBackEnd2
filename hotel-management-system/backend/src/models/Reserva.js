import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Reserva = sequelize.define('Reserva', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'clientes',
      key: 'id'
    },
    validate: {
      notEmpty: { msg: 'Cliente é obrigatório' }
    }
  },
  quartoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'quartos',
      key: 'id'
    },
    validate: {
      notEmpty: { msg: 'Quarto é obrigatório' }
    }
  },
  dataCheckIn: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Data de check-in é obrigatória' },
      isDate: { msg: 'Data de check-in inválida' }
    }
  },
  dataCheckOut: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Data de check-out é obrigatória' },
      isDate: { msg: 'Data de check-out inválida' },
      isAfterCheckIn(value) {
        if (value <= this.dataCheckIn) {
          throw new Error('Data de check-out deve ser posterior ao check-in');
        }
      }
    }
  },
  numeroDias: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  valorTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pendente', 'confirmada', 'cancelada', 'finalizada'),
    allowNull: false,
    defaultValue: 'pendente',
    validate: {
      isIn: {
        args: [['pendente', 'confirmada', 'cancelada', 'finalizada']],
        msg: 'Status inválido'
      }
    }
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'reservas',
  timestamps: true,
  hooks: {
    // Hook para calcular número de dias e valor total antes de salvar
    beforeValidate: async (reserva) => {
      if (reserva.dataCheckIn && reserva.dataCheckOut) {
        // Calcular número de dias
        const checkIn = new Date(reserva.dataCheckIn);
        const checkOut = new Date(reserva.dataCheckOut);
        const diffTime = Math.abs(checkOut - checkIn);
        reserva.numeroDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
    }
  }
});

export default Reserva;
