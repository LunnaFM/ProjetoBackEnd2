import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Nome é obrigatório' },
      len: { args: [3, 100], msg: 'Nome deve ter entre 3 e 100 caracteres' }
    }
  },
  cpf: {
    type: DataTypes.STRING(14),
    allowNull: false,
    unique: {
      msg: 'CPF já cadastrado'
    },
    validate: {
      notEmpty: { msg: 'CPF é obrigatório' },
      is: {
        args: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
        msg: 'CPF deve estar no formato 000.000.000-00'
      }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Email é obrigatório' },
      isEmail: { msg: 'Email inválido' }
    }
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Telefone é obrigatório' }
    }
  },
  endereco: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  dataNascimento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: { msg: 'Data de nascimento inválida' },
      isBefore: {
        args: new Date().toISOString().split('T')[0],
        msg: 'Data de nascimento não pode ser no futuro'
      }
    }
  }
}, {
  tableName: 'clientes',
  timestamps: true
});

export default Cliente;
