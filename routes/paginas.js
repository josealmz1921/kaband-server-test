const express = require('express');
const router = express.Router();
const paginaInicioController = require('../controllers/paginaInicioController');
const paginaNosotrosController = require('../controllers/paginaNosotrosControlles');
const paginaContacto = require('../controllers/paginaContacto');
const Multer = require('multer');
const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb
  }
});

// Seccion slider
router.get('/slider',paginaInicioController.obtenerSeccionSlider);
router.put('/slider',multer.single('imagen'),paginaInicioController.modificarSeccionSlider);
router.post('/slider',multer.single('imagen'),paginaInicioController.crearSeccionSlider);
router.delete('/slider/:id',paginaInicioController.eliminarSlider);

// Seccion categorias
router.delete('/categorias/:id',paginaInicioController.eliminarSeccionCategoriasDestacadas);
router.get('/categorias',paginaInicioController.obtenerSeccionCategoriasDestacadas);
router.post('/categorias',multer.single('imagen'),paginaInicioController.modificarSeccionCategoriasDestacadas);


// Seccion productos
router.get('/productos',paginaInicioController.obtenerSeccionProductosDestacados);
router.post('/productos',paginaInicioController.modificarSeccionProductosDestacados);
router.delete('/productos/:id',paginaInicioController.eliminarSeccionProductos);

// Seccion sobre nosotros
router.get('/sobreNosotros',paginaInicioController.obtenerSeccionSobreNosotros);
router.post('/sobreNosotros',multer.fields([{ name: 'imagenGrande', maxCount: 1 }, { name: 'imagen1', maxCount: 1 }, { name: 'imagen2', maxCount:1 }]),paginaInicioController.modificarSeccionSobreNosotros);
router.put('/sobreNosotros',paginaInicioController.agregarItemSobreNosotros);

// Seccion video
router.get('/video',paginaInicioController.obtenerSeccionVideo);
router.post('/video',paginaInicioController.modificarSeccionVideo);

// Seccion caracteristicas
router.get('/caracteristicas',paginaInicioController.obtenerSeccionCaracteristicas);
router.put('/caracteristicas',multer.single('imagen'),paginaInicioController.modificarSeccionCaracteristicas);
router.post('/caracteristicas',multer.single('imagen'),paginaInicioController.crearSeccionCaracteristicas);
router.delete('/caracteristicas/:id',paginaInicioController.eliminarCaracteristicas);

// Pagina nosotros 
router.post('/nosotros',multer.fields([{name:'imagen'},{name:"imagenes"}]),paginaNosotrosController.crearSeccionNosotros);
router.put('/nosotros',multer.fields([{name:'imagen'},{name:"imagenes"}]),paginaNosotrosController.editarSeccionNosotros);
router.get('/nosotros',paginaNosotrosController.obtenerSeccionNosotros);
router.delete('/nosotros/:id',paginaNosotrosController.eliminarSeccionNosotros);
router.put('/eliminar',paginaNosotrosController.eliminarImagenes);

// Pagina contacto
router.put('/contacto',paginaContacto.editarContacto);
router.get('/contacto',paginaContacto.obtenerContactos);

// Pagina Terminos y condiciones
router.put('/terminos',paginaContacto.editarTerminos);
router.get('/terminos',paginaContacto.obtenerTerminos);

// Pagina Aviso de privacidad
router.put('/privacidad',paginaContacto.editarPrivacidad);
router.get('/privacidad',paginaContacto.obtenerPrivacidad);

module.exports = router;