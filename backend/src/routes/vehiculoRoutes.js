import { Router } from 'express';
import pool from '../config/db.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', verificarToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vehiculos');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener vehículos.', error: error.message });
  }
});

router.post('/', verificarToken, async (req, res) => {
  const { marca, modelo, patente, anio, capacidad_carga } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO vehiculos (marca, modelo, patente, anio, capacidad_carga) VALUES (?, ?, ?, ?, ?)',
      [marca, modelo, patente, anio, capacidad_carga]
    );
    res.status(201).json({ id: result.insertId, marca, modelo, patente, anio, capacidad_carga });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar vehículo.', error: error.message });
  }
});

export default router;