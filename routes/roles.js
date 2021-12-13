const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rolesController = require('../controllers/rolesController');

router.get('/roles',rolesController.obteneAllRoles);

router.get('/:page/',rolesController.obtenerRoles);

router.get('/rol/:_id',rolesController.obtenerRol);

router.post('/',rolesController.crearRol);

router.put('/',rolesController.editarRol);

router.delete('/:_id',rolesController.eliminarRol);


module.exports = router;