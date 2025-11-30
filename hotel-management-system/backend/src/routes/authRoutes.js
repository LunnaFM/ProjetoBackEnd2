import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

// Rotas públicas
router.post('/register', register);
router.post('/login', login);

// Rotas protegidas
router.get('/me', authMiddleware, getMe);

export default router;
