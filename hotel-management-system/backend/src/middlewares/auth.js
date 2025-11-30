import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  try {
    // Pegar o token do header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: 'Token não fornecido' 
      });
    }

    // Formato: Bearer <token>
    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      return res.status(401).json({ 
        success: false,
        message: 'Formato de token inválido' 
      });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ 
        success: false,
        message: 'Token mal formatado' 
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Adicionar informações do usuário na requisição
    req.userId = decoded.id;
    req.userEmail = decoded.email;

    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token inválido' 
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expirado' 
      });
    }

    return res.status(500).json({ 
      success: false,
      message: 'Erro ao validar token',
      error: error.message 
    });
  }
};

export default authMiddleware;
