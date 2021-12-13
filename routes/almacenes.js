const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const almacenesController = require('../controllers/almacenesController');

router.get('/',almacenesController.obtenerAlmacenes);

router.post('/',almacenesController.crearAlmacen);

router.put('/',almacenesController.editarAlmacen);

router.delete('/:_id',almacenesController.eliminarAlmacen);

module.exports = router;