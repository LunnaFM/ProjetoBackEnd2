import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';

const User = sequelize.define('User', {
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
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      msg: 'Email já cadastrado'
    },
    validate: {
      notEmpty: { msg: 'Email é obrigatório' },
      isEmail: { msg: 'Email inválido' }
    }
  },
  senha: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Senha é obrigatória' },
      len: { args: [6, 255], msg: 'Senha deve ter no mínimo 6 caracteres' }
    }
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    // Hook para hash da senha antes de salvar
    beforeCreate: async (user) => {
      if (user.senha) {
        const salt = await bcrypt.genSalt(10);
        user.senha = await bcrypt.hash(user.senha, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('senha')) {
        const salt = await bcrypt.genSalt(10);
        user.senha = await bcrypt.hash(user.senha, salt);
      }
    }
  }
});

// Método para verificar senha
User.prototype.verificarSenha = async function(senha) {
  return await bcrypt.compare(senha, this.senha);
};

// Não retornar a senha nas queries
User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.senha;
  return values;
};

export default User;
