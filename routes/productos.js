const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const productosController = require('../controllers/productosController');
const Multer = require('multer');
const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb
  }
});

router.get('/similares/:categoria/:id',productosController.productosSimilares);
router.get('/producto/:_id',productosController.obtenerProducto);
router.get('/:page/:name',productosController.obtenerProductos);
router.get('/movimientos/:page/:name',productosController.obtenerMovimientos);
router.get('/all',productosController.obtenerAllProductos);
router.post('/',multer.fields([{name:'imagen'},{name:"imagenes"}]),productosController.crearProducto);
router.put('/',multer.fields([{name:'imagen'},{name:"imagenes"}]),productosController.editarProducto);
router.put('/stock',productosController.editarStock);
router.delete('/:_id',productosController.eliminarProdcuto);
router.put('/imagenes',multer.fields([{name:'imagen'},{name:"imagenes"},{name:'pdf'}]),productosController.editarImagenes);
router.put('/eliminar',productosController.eliminarImagenes);
router.put('/coloresImagen',productosController.imagenColores);
router.put('/desvincularColor',productosController.eliminarImagenColor);
router.put('/principal',productosController.convertirPrincipal);
router.put('/vincular',productosController.vincularProductos);

module.exports = router;