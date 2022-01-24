const express = require('express');
const router = express.Router();
const sectoresController = require('../controllers/sectoresController');

router.get('/',sectoresController.obtenerSectores);
router.post('/',sectoresController.crearSector);
router.put('/',sectoresController.editarSector);
router.delete('/:id',sectoresController.eliminarSector);

module.exports = router;