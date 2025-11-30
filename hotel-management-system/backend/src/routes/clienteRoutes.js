import express from 'express';
import {
  listarClientes,
  buscarCliente,
  criarCliente,
  atualizarCliente,
  excluirCliente
} from '../controllers/clienteController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

// Todas as rotas de clientes são protegidas
router.use(authMiddleware);

router.get('/', listarClientes);
router.get('/:id', buscarCliente);
router.post('/', criarCliente);
router.put('/:id', atualizarCliente);
router.delete('/:id', excluirCliente);

export default router;
