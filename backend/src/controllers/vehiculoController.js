const pool = require('../config/db');

const obtenerVehiculos = async (req, res) => {
  try {
    const [vehiculos] = await pool.query('SELECT * FROM vehiculos');
    res.json(vehiculos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los vehículos' });
  }
};

const crearVehiculo = async (req, res) => {
  try {
    const { marca, modelo, patente, anio, capacidad_carga } = req.body;

    const [existing] = await pool.query('SELECT * FROM vehiculos WHERE patente = ?', [patente]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Ya existe un vehículo registrado con esa patente.' });
    }

    const [result] = await pool.query(
      'INSERT INTO vehiculos (marca, modelo, patente, anio, capacidad_carga) VALUES (?, ?, ?, ?, ?)',
      [marca, modelo, patente, anio, capacidad_carga]
    );

    res.status(201).json({
      mensaje: 'Vehículo registrado con éxito',
      vehiculoId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar el vehículo' });
  }
};

module.exports = {
  obtenerVehiculos,
  crearVehiculo
};