const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ventasController = require('../controllers/ventasController');

router.get('/cancelar/:_id/:usuario',ventasController.cancelarVenta);

router.get('/pagar/:_id/:formaPago',ventasController.pagarVenta);

router.get('/:page/:name',ventasController.obtenerVentas);

router.post('/',ventasController.crearVenta);

router.delete('/:_id',ventasController.obtenerVenta);

module.exports = router;