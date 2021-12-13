// Rutas para crear ususarios
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');


//Iniciar sesions
// api/auth
router.post('/',
// Validacion de API
authController.autenticarUsuario);

router.get('/',
    auth,
    authController.usuarioAutenticado
);

router.put('/usuario',authController.cambiarUsuario);

router.put('/password',authController.cambiarPassword);

module.exports = router;  