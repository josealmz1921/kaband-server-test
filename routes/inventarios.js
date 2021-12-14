const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const inventariosController = require('../controllers/inventariosController');


router.post('/excel',inventariosController.leerExcel);

module.exports = router;