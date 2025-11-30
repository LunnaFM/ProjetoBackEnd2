import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/index.js';

dotenv.config();

// Gerar JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      nome: user.nome
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Verificar se usuário já existe
    const userExists = await User.findOne({ where: { email } });
    
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: 'Email já cadastrado' 
      });
    }

    // Criar usuário
    const user = await User.create({ nome, email, senha });

    // Gerar token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso',
      data: {
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao cadastrar usuário',
      error: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validar campos
    if (!email || !senha) {
      return res.status(400).json({ 
        success: false,
        message: 'Email e senha são obrigatórios' 
      });
    }

    // Buscar usuário (incluindo senha para verificação)
    const user = await User.findOne({ 
      where: { email },
      attributes: { include: ['senha'] }
    });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Email ou senha inválidos' 
      });
    }

    // Verificar senha
    const senhaValida = await user.verificarSenha(senha);

    if (!senhaValida) {
      return res.status(401).json({ 
        success: false,
        message: 'Email ou senha inválidos' 
      });
    }

    // Gerar token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login',
      error: error.message
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuário não encontrado' 
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar dados do usuário',
      error: error.message
    });
  }
};
