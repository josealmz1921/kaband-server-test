const SeccionSlider = require('../models/SeccionSlider');
const SeccionCaracteristicas = require('../models/SeccionCaracteristicas');
const SeccionCategoriasDestacadas = require('../models/SeccionCategoriasDestacadas');
const SeccionProductosDestacados = require('../models/SeccionProductosDestacados');
const SeccionSobreNosotros = require('../models/SeccionSobreNosotros');
const SeccionDetalles = require('../models/SeccionDetalles');
const SeccionVideo = require('../models/SeccionVideo');
const {subirImagen} = require('../functions/subirImagen');
const {eliminarImagen} = require('../functions/eliminarImagen');
const Categorias = require('../models/Categorias');
const Productos = require('../models/Productos');

exports.obtenerSeccionDetalles = async (req,res) => {
    try {

        const busqueda = await SeccionDetalles.findById({_id:'61bfe779d4f2e6d765cc5a79'});
        res.json(busqueda)

    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:'Ha ocurrido un error al obtener la informacion'})
    }
}

exports.modificarSeccionDetalles = async (req,res) => {
    try {

        const busqueda = await SeccionDetalles.findById({_id:'61bfe779d4f2e6d765cc5a79'});

        let error = '';
        const { titulo1,titulo2,titulo3,titulo4,titulo5,titulo6,texto1,texto2,categoria1,categoria2,categoria3,categoria4,categoria5,categoria6 } = req.body;
        
        let seccion = {};
        seccion.texto1 = texto1;
        seccion.texto2 = texto2;
        seccion.titulo1 = titulo1;
        seccion.titulo2 = titulo2;
        seccion.titulo3 = titulo3;
        seccion.titulo4 = titulo4;
        seccion.titulo5 = titulo5;
        seccion.titulo6 = titulo6;
        seccion.categoria1 = categoria1;
        seccion.categoria2 = categoria2;
        seccion.categoria3 = categoria3;
        seccion.categoria4 = categoria4;
        seccion.categoria5 = categoria5;
        seccion.categoria6 = categoria6;


        if(req.files['imagen1']){
            let imagenNueva = await subirImagen(req.files['imagen1'][0]);
            if(imagenNueva){
                seccion.imagen1 = imagenNueva;
                eliminarImagen(busqueda.imagen1)
            }else{
                error = `${error} \n No se ha podido subir la imagen 1.`;
            }
        }

        if(req.files['imagen2']){
            let imagenNueva = await subirImagen(req.files['imagen2'][0]);
            if(imagenNueva){
                seccion.imagen2 = imagenNueva;
                eliminarImagen(busqueda.imagen2)
            }else{
                error = `${error} \n No se ha podido subir la imagen 2.`;
            }
        }

        if(req.files['imagen3']){
            let imagenNueva = await subirImagen(req.files['imagen3'][0]);
            if(imagenNueva){
                seccion.imagen3 = imagenNueva;
                eliminarImagen(busqueda.imagen3)
            }else{
                error = `${error} \n No se ha podido subir la imagen 3.`;
            }
        }

        if(req.files['imagen4']){
            let imagenNueva = await subirImagen(req.files['imagen4'][0]);
            if(imagenNueva){
                seccion.imagen4 = imagenNueva;
                eliminarImagen(busqueda.imagen4)
            }else{
                error = `${error} \n No se ha podido subir la imagen 4.`;
            }
        }

        if(req.files['imagen5']){
            let imagenNueva = await subirImagen(req.files['imagen5'][0]);
            if(imagenNueva){
                seccion.imagen5 = imagenNueva;
                eliminarImagen(busqueda.imagen5)
            }else{
                error = `${error} \n No se ha podido subir la imagen 5.`;
            }
        }

        if(req.files['imagen6']){
            let imagenNueva = await subirImagen(req.files['imagen6'][0]);
            if(imagenNueva){
                seccion.imagen6 = imagenNueva;
                eliminarImagen(busqueda.imagen6)
            }else{
                error = `${error} \n No se ha podido subir la imagen 6.`;
            }
        }

        await SeccionDetalles.findByIdAndUpdate({_id:'61bfe779d4f2e6d765cc5a79'},seccion,{new:true})
        res.json({msg:'Seccion guardada correctamente'})


    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:'Ha ocurrido un error al modificar la seccion'})
    }
}

exports.modificarSeccionSlider = async (req,res) => {
    try {
        const { texto1,texto2,texto3,position,imagenNombre,_id } = req.body;

        let nuevoSlider = {};
        nuevoSlider.texto1 = texto1;
        nuevoSlider.texto2 = texto2;
        nuevoSlider.texto3 = texto3;
        nuevoSlider.position = position;

        if(req.file){
            const imagenNueva = await subirImagen(req.file);
            if(imagenNueva){
                nuevoSlider.imagen = imagenNueva;
                eliminarImagen(imagenNombre);
            }else{
                return res.status(400).json({msg:'Error al modificar la seccion'})
            }
        }

        const slider = await SeccionSlider.findByIdAndUpdate({_id},nuevoSlider,{new:true})
        res.json({slider});
        
    } catch (error) {
        console.log(error);
        res.status(400).json({msg:'Error al modificar la seccion'})
    }
}

exports.crearSeccionSlider = async (req,res) => {
    try {

        const { texto1,texto2,texto3,position } = req.body;

        let nuevoSlider = {};
        nuevoSlider.texto1 = texto1;
        nuevoSlider.texto2 = texto2;
        nuevoSlider.texto3 = texto3;
        nuevoSlider.position = position;

        const imagen = await subirImagen(req.file);

        if(imagen){
            nuevoSlider.imagen = imagen;
        }else{
            return res.status(400).json({msg:'Error al modificar la seccion'})
        }

        const slider = new SeccionSlider(nuevoSlider);
        await slider.save();
        res.json({slider});
        
    } catch (error) {
        console.log(error);
        res.status(400).json({msg:'Error al modificar la seccion'})
    }
}

exports.obtenerSeccionSlider = async (req,res) => {
    try {

        const slider = await SeccionSlider.find();
        res.json({slider});
        
    } catch (error) {
        res.status(400).json({msg:'Error al obtener la seccion'})
    }
}

exports.eliminarSlider = async (req,res) => {
    try {
        const slider = await SeccionSlider.findById({_id:req.params.id});
        eliminarImagen(slider.imagen);
        await SeccionSlider.findByIdAndDelete({_id:req.params.id});
        res.json({msg:'Elemento eliminado correctamente'});

        
    } catch (error) {
        console.log(error);
        res.status(400).json({msg:'Error al eliminar el contenido'});
    }
}

exports.modificarSeccionCategoriasDestacadas = async (req,res) => {
    try {

        const { categoria } = req.body;
        
        let nuevaCategoriaDestacada = {};
        nuevaCategoriaDestacada.categoria = categoria;

        const imagen = await subirImagen(req.file);

        if(imagen){
            nuevaCategoriaDestacada.imagen = imagen;
        }else{
            return res.status(400).json({msg:'Error al agregar la categoria'})
        }

        const categoriaSave = new SeccionCategoriasDestacadas(nuevaCategoriaDestacada);
        await categoriaSave.save();
        res.json({categoriaSave});
        
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({msg:'Error al agregar la categoria'})
    }
}

exports.eliminarSeccionCategoriasDestacadas = async (req,res) => {
    try {

        const slider = await SeccionCategoriasDestacadas.findById({_id:req.params.id});
        eliminarImagen(slider.imagen);
        await SeccionCategoriasDestacadas.findByIdAndDelete({_id:req.params.id});
        res.json({msg:'Categoria eliminado correctamente'});

        
    } catch (error) {
        console.log(error);
        res.status(400).json({msg:'Error al eliminar el contenido'});
    }
}

exports.obtenerSeccionCategoriasDestacadas = async (req,res) => {
    try {

        const resultados = await SeccionCategoriasDestacadas.find();
        const categorias = await Promise.all(
            resultados.map(async result => {
                let item = JSON.parse(JSON.stringify(result));
                const categorias = await Categorias.findById({_id:result.categoria});
                if(categorias){
                    item.nombreCategoria = categorias.nombre;
                }else{
                    item.nombreCategoria = 'Undefined';
                }
                return item;
            })
        )

        res.json({categorias});
        
    } catch (error) {
        console.log(error);
        res.status(400).json({msg:'Error al obtener las categorias'})
    }
}

exports.modificarSeccionProductosDestacados = async (req,res) => {
    try {
        
        let nuevaProductoDestacado = {};
        nuevaProductoDestacado.producto = req.body._id;

        const productos = new SeccionProductosDestacados(nuevaProductoDestacado);
        await productos.save();
        res.json({productos});
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({msg:'Error al agregar la categoria'})
    }
}

exports.obtenerSeccionProductosDestacados = async (req,res) => {
    try {

        const resultados = await SeccionProductosDestacados.find();
        const productos = await Promise.all(
            resultados.map(async result => {
                let item = JSON.parse(JSON.stringify(result));
                const productos = await Productos.findById({_id:result.producto});
                if(productos){
                    item.nombre = productos.nombre;
                    item.img = productos.img;
                    item.precioVenta = productos.precioVenta;
                    item.colores = productos.colores;
                }else{
                    item.nombreproductos = 'Undefined';
                }
                return item;
            })
        )

        res.json({productos});
        
    } catch (error) {
        console.log(error);
        res.status(400).json({msg:'Error al obtener las productos'})
    }
}

exports.eliminarSeccionProductos = async (req,res) => {
    try {

        await SeccionProductosDestacados.findByIdAndDelete({_id:req.params.id});
        res.json({msg:'Elemento eliminado correctamente'});
        
    } catch (error) {
        console.log(error);
        res.status(400).json({msg:'Error al eliminar el contenido'});
    }
}

exports.modificarSeccionSobreNosotros = async (req,res) => {
    try {

        let error = '';

        const imagenes = await SeccionSobreNosotros.findById({_id:'61a0376b0e6fd5de604d8862'});
        let nuevasImagenes = {};
        
        if(req.files['imagenGrande']){
            const imagenNueva = await subirImagen(req.files['imagenGrande'][0]);
            if(imagenNueva){
                nuevasImagenes.imagenGrande = imagenNueva;
                imagenes.imagenGrande ? eliminarImagen(imagenes.imagenGrande) : null;
            }else{
                error = `${error} \n No se ha podido subir la imagen grande.`;
            }
        }

        if(req.files['imagen1']){
            const imagenNueva = await subirImagen(req.files['imagen1'][0]);
            if(imagenNueva){
                nuevasImagenes.imagen1 = imagenNueva;
                imagenes.imagen1 ? eliminarImagen(imagenes.imagen1) : null ;
            }else{
                error = `${error} \n No se ha podido subir la imagen 1.`;
            }
        }

        if(req.files['imagen2']){
            const imagenNueva = await subirImagen(req.files['imagen2'][0]);
            if(imagenNueva){
                nuevasImagenes.imagen2 = imagenNueva;
                imagenes.imagen2 ? eliminarImagen(imagenes.imagen2) : null;
            }else{
                error = `${error} \n No se ha podido subir la imagen 2.`;
            }
        }

        if(error.length > 0){
            res.status(400).json({msg:error})
        }else{
            res.json({msg:'Contenido actualizado correctamente'})
        }

        await SeccionSobreNosotros.findByIdAndUpdate({_id:'61a0376b0e6fd5de604d8862'},nuevasImagenes,{new:true})

    } catch (error) {
        console.log(error);
        res.status(400).json({msg:'Error al subir la(s) imagenes'})
    }
}

exports.agregarItemSobreNosotros = async (req,res) => {
    try {

        await SeccionSobreNosotros.findByIdAndUpdate({_id:'61a0376b0e6fd5de604d8862'},{listado:req.body},{new:true})
        res.json({msg:'Contenido actualizado correctamente'})

    } catch (error) {
        console.log(error);
        res.status(400).json({msg:'Error al agregar el elemento'})
    }
}

exports.obtenerSeccionSobreNosotros = async (req,res) => {
    try {

        const listado = await SeccionSobreNosotros.findById({_id:'61a0376b0e6fd5de604d8862'});
        res.json({listado});
        
    } catch (error) {
        console.log(error);
        res.status(400).json({msg:'Error al obtener el elemento'})
    }
}

exports.modificarSeccionVideo = async (req,res) => {
    try {

        const {titulo,subtitulo,descripcion,idvideo} = req.body;

        let nuevaSeccion = {};

        nuevaSeccion.titulo = titulo;
        nuevaSeccion.subtitulo = subtitulo;
        nuevaSeccion.descripcion = descripcion;
        nuevaSeccion.video = idvideo;

        await SeccionVideo.findByIdAndUpdate({_id:'61a2a9af0e6fd5de604d8863'},nuevaSeccion,{new:true});
        res.json({msg:'Contenido actualizado correctamente'});
    } catch (error) {
        res.status(400).json({msg:'Error al modificar el contenido'})
    }
}

exports.obtenerSeccionVideo = async (req,res) => {
    try {
        const datos = await SeccionVideo.findById({_id:'61a2a9af0e6fd5de604d8863'});
        res.json({datos});
    } catch (error) {
        console.log(error);
        res.status(400).json({msg:'Error al obtener el elemento'})
    }
}

exports.modificarSeccionCaracteristicas = async (req,res) => {
    try {
        const { titulo,descripcion,imagenNombre,_id } = req.body;

        let nuevaCaracteristica = {};
        nuevaCaracteristica.titulo = titulo;
        nuevaCaracteristica.descripcion = descripcion;

        if(req.file){
            const imagenNueva = await subirImagen(req.file);
            if(imagenNueva){
                nuevaCaracteristica.imagen = imagenNueva;
                eliminarImagen(imagenNombre);
            }else{
                return res.status(400).json({msg:'Error al modificar la seccion'})
            }
        }

        const caracteristica = await SeccionCaracteristicas.findByIdAndUpdate({_id},nuevaCaracteristica,{new:true})
        res.json({caracteristica});
        
    } catch (error) {
        console.log(error);
        res.status(400).json({msg:'Error al modificar la seccion'})
    }
}

exports.crearSeccionCaracteristicas = async (req,res) => {
    try {

        const { titulo,descripcion } = req.body;

        let nuevaCaracteristica = {};
        nuevaCaracteristica.titulo = titulo;
        nuevaCaracteristica.descripcion = descripcion;

        const imagen = await subirImagen(req.file);

        if(imagen){
            nuevaCaracteristica.imagen = imagen;
        }else{
            return res.status(400).json({msg:'Error al modificar la seccion'})
        }

        const caracteristica = new SeccionCaracteristicas(nuevaCaracteristica);
        await caracteristica.save();
        res.json({caracteristica});
        
    } catch (error) {
        console.log(error);
        res.status(400).json({msg:'Error al modificar la seccion'})
    }
}

exports.obtenerSeccionCaracteristicas = async (req,res) => {
    try {

        const caracteristica = await SeccionCaracteristicas.find();
        res.json({caracteristica});
        
    } catch (error) {
        res.status(400).json({msg:'Error al obtener la seccion'})
    }
}

exports.eliminarCaracteristicas = async (req,res) => {
    try {
        const caracteristica = await SeccionCaracteristicas.findById({_id:req.params.id});
        eliminarImagen(caracteristica.imagen);
        await SeccionCaracteristicas.findByIdAndDelete({_id:req.params.id});
        res.json({msg:'Elemento eliminado correctamente'});

        
    } catch (error) {
        console.log(error);
        res.status(400).json({msg:'Error al eliminar el contenido'});
    }
}