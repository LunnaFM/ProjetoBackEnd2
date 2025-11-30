import express from 'express';
import {
  listarReservas,
  buscarReserva,
  criarReserva,
  atualizarReserva,
  excluirReserva,
  cancelarReserva
} from '../controllers/reservaController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

// Todas as rotas de reservas são protegidas
router.use(authMiddleware);

router.get('/', listarReservas);
router.get('/:id', buscarReserva);
router.post('/', criarReserva);
router.put('/:id', atualizarReserva);
router.delete('/:id', excluirReserva);
router.patch('/:id/cancelar', cancelarReserva);

export default router;
