import sequelize from '../config/database.js';
import User from './User.js';
import Cliente from './Cliente.js';
import Quarto from './Quarto.js';
import Reserva from './Reserva.js';

// Definindo relacionamentos
// Um Cliente pode ter várias Reservas
Cliente.hasMany(Reserva, {
  foreignKey: 'clienteId',
  as: 'reservas',
  onDelete: 'CASCADE'
});

Reserva.belongsTo(Cliente, {
  foreignKey: 'clienteId',
  as: 'cliente'
});

// Um Quarto pode ter várias Reservas
Quarto.hasMany(Reserva, {
  foreignKey: 'quartoId',
  as: 'reservas',
  onDelete: 'CASCADE'
});

Reserva.belongsTo(Quarto, {
  foreignKey: 'quartoId',
  as: 'quarto'
});

// Sincronizar modelos com o banco de dados
export const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Modelos sincronizados com o banco de dados!');
  } catch (error) {
    console.error('❌ Erro ao sincronizar modelos:', error.message);
  }
};

export { User, Cliente, Quarto, Reserva };
export default sequelize;
