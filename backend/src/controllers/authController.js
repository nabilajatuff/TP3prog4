import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const registrarUsuario = async (req, res) => {
  const { nombre, email, contraseña } = req.body;
  try {
    const [existe] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (existe.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contraseña, salt);

    await pool.query(
      'INSERT INTO usuarios (nombre, email, contraseña) VALUES (?, ?, ?)',
      [nombre, email, hash]
    );

    res.status(201).json({ message: 'Usuario registrado exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario.', error: error.message });
  }
};

export const loginUsuario = async (req, res) => {
  const { email, contraseña } = req.body;
  try {
    const [usuarios] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (usuarios.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const usuario = usuarios[0];
    const passwordValido = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!passwordValido) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET || 'secreto_super_seguro',
      { expiresIn: '2h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión.', error: error.message });
  }
};