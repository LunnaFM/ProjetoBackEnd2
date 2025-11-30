import express from 'express';
import authRoutes from './authRoutes.js';
import clienteRoutes from './clienteRoutes.js';
import quartoRoutes from './quartoRoutes.js';
import reservaRoutes from './reservaRoutes.js';

const router = express.Router();

// Rotas da API
router.use('/auth', authRoutes);
router.use('/clientes', clienteRoutes);
router.use('/quartos', quartoRoutes);
router.use('/reservas', reservaRoutes);

// Rota de teste
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Hotel Management System está rodando!',
    timestamp: new Date().toISOString()
  });
});

export default router;
