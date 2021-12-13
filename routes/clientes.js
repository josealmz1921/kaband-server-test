const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const clientesController = require('../controllers/clientesController');

router.get('/cliente/:_id',clientesController.obtenerCliente);

router.get('/:page/:name',clientesController.obtenerClientes);

router.get('/all',clientesController.obtenerAllClientes);

router.post('/',clientesController.crearCliente);

router.put('/',clientesController.editarClientes); 

router.delete('/:_id',clientesController.eliminarCliente);

module.exports = router;