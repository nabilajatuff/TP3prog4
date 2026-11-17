const express = require('express');
const router = express.Router();
const passport = require('passport');
const { obtenerVehiculos, crearVehiculo } = require('../controllers/vehiculoController');

// Rutas protegidas con Passport (exigen token JWT válido)
router.get('/', passport.authenticate('jwt', { session: false }), obtenerVehiculos);
router.post('/', passport.authenticate('jwt', { session: false }), crearVehiculo);

module.exports = router;