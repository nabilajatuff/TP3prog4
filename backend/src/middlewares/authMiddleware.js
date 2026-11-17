import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET || 'secreto_super_seguro');
    req.usuario = verificado;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};