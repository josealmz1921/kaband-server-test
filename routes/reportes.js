const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const reportesController = require('../controllers/reportesController');

router.get('/inicio/:rol/:_id',reportesController.reporteInicio);
router.get('/productos',reportesController.exportarProdutos);
router.get('/excel',reportesController.reporteExcelVendedores);
router.get('/ventas/:page/:name',reportesController.reporteVentas);
router.get('/:date',reportesController.reporteProductos);


module.exports = router;