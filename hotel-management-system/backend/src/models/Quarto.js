import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Quarto = sequelize.define('Quarto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: {
      msg: 'Número do quarto já cadastrado'
    },
    validate: {
      notEmpty: { msg: 'Número do quarto é obrigatório' }
    }
  },
  tipo: {
    type: DataTypes.ENUM('solteiro', 'casal', 'luxo', 'suite'),
    allowNull: false,
    defaultValue: 'solteiro',
    validate: {
      notEmpty: { msg: 'Tipo do quarto é obrigatório' },
      isIn: {
        args: [['solteiro', 'casal', 'luxo', 'suite']],
        msg: 'Tipo inválido. Use: solteiro, casal, luxo ou suite'
      }
    }
  },
  capacidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Capacidade é obrigatória' },
      min: { args: [1], msg: 'Capacidade mínima é 1 pessoa' },
      max: { args: [10], msg: 'Capacidade máxima é 10 pessoas' }
    }
  },
  valorDiaria: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Valor da diária é obrigatório' },
      min: { args: [0.01], msg: 'Valor da diária deve ser maior que zero' }
    }
  },
  status: {
    type: DataTypes.ENUM('disponivel', 'ocupado', 'manutencao'),
    allowNull: false,
    defaultValue: 'disponivel',
    validate: {
      isIn: {
        args: [['disponivel', 'ocupado', 'manutencao']],
        msg: 'Status inválido. Use: disponivel, ocupado ou manutencao'
      }
    }
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'quartos',
  timestamps: true
});

export default Quarto;
