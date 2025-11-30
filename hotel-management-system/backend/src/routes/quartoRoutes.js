import express from 'express';
import {
  listarQuartos,
  buscarQuarto,
  criarQuarto,
  atualizarQuarto,
  excluirQuarto,
  listarQuartosDisponiveis
} from '../controllers/quartoController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

// Todas as rotas de quartos são protegidas
router.use(authMiddleware);

router.get('/', listarQuartos);
router.get('/disponiveis', listarQuartosDisponiveis);
router.get('/:id', buscarQuarto);
router.post('/', criarQuarto);
router.put('/:id', atualizarQuarto);
router.delete('/:id', excluirQuarto);

export default router;
