const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const categoriasController = require('../controllers/categoriasController');
const Multer = require('multer');
const multer = Multer({storage: Multer.MemoryStorage});

router.get('/categorias/padre',categoriasController.obtenerCategoriasPagina);

router.get('/categorias/hijo/:id',categoriasController.obtenerCategoriasPaginaHijos);

router.get('/:page/:name',categoriasController.obtenerCategorias);

router.post('/',categoriasController.crearCategoria);

router.put('/',categoriasController.editarCategoria);

router.delete('/:_id',categoriasController.eliminarCategoria);

router.get('/categoria/cat/:_id',categoriasController.obtenerCategoria);

router.get('/categorias',categoriasController.obtenerCategoriasAll);

router.put('/imagenes',multer.fields([{ name: 'imagenMenu', maxCount: 1 }, { name: 'imagenCategoria', maxCount: 1 }]),categoriasController.imagenesCategoria);


module.exports = router;