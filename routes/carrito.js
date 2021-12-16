const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const carritoController = require('../controllers/carritoController');

router.post('/comparar',carritoController.obtenerComprar);
router.post('/producto',carritoController.obtenerProductos);
router.post('/pagar',carritoController.pagarProductos);
router.get('/ventas/:page',carritoController.obtenerVentas);
router.put('/venta',carritoController.cambiarStatus);

module.exports = router;