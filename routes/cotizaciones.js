const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const cotizacionesController = require('../controllers/cotizacionesController');

router.delete('/:_id',cotizacionesController.cancelarCotizacion);

router.get('/remision/:_id',cotizacionesController.remision);

router.get('/:page/:name',cotizacionesController.obtenerCotizaciones);

router.put('/',cotizacionesController.editarCotizacion);

router.post('/',cotizacionesController.crearCotizacion);


module.exports = router;