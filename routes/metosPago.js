const express = require('express');
const router = express.Router();
const metodosPagoController = require('../controllers/metodosPagoController');

router.get('/',metodosPagoController.obtenerMetodosPago);
router.post('/',metodosPagoController.crearMetodoPago);
router.put('/',metodosPagoController.editarMetodoPago);
router.delete('/:id',metodosPagoController.eliminarMetodoPago);

module.exports = router;