const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const usuariosController = require('../controllers/usuariosController');
const sendEmail = require('../functions/sendEmail');

router.get('/usuarios',usuariosController.obtenerUsuariosAll);

router.get('/:page',usuariosController.obtenerUsuarios);

router.post('/',usuariosController.crearUsuario);

router.put('/',usuariosController.editarUsuario);

router.delete('/:_id',usuariosController.eliminarUsuario);

router.post('/email',sendEmail.sendMailSell);



module.exports = router;