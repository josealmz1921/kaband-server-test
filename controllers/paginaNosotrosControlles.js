const Nosotros = require('../models/Nosotros');
const {subirImagen} = require('../functions/subirImagen');
const {eliminarImagen} = require('../functions/eliminarImagen');

exports.crearSeccionNosotros = async (req,res) => {
    try {

        let imagenes = [];

        const { texto1,texto2,texto3,posicion,descripcion } = req.body;

        let informacion = {};
        informacion.posicion = posicion;
        informacion.texto1 = texto1;
        informacion.texto2 = texto2;
        informacion.texto3 = texto3;
        informacion.descripcion = descripcion;

        await Promise.all(
            req.files['imagenes'].map( async imagen => {
                const imagenNueva = await subirImagen(imagen);
                if(imagenNueva){
                    imagenes.push(imagenNueva);
                }
            })
        )

        informacion.imagenes = imagenes;

        if(req.files['imagen']){
            const imagenNueva = await subirImagen(req.files['imagen'][0]);
            if(imagenNueva){
                informacion.imagen = imagenNueva;
            }
        }

        const nosotros = new Nosotros(informacion);
        await nosotros.save();

        return res.json({nosotros});

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Error al actualizar el contenido'})
    }
}

exports.editarSeccionNosotros = async (req,res) => {
    try {

        let imagenes = [];

        const { texto1,texto2,texto3,posicion,descripcion,listadoImagenes,imagenBaja,_id } = req.body;

        imagenes = JSON.parse(listadoImagenes);

        let informacion = {};
            informacion.posicion = posicion;
            informacion.texto1 = texto1;
            informacion.texto2 = texto2;
            informacion.texto3 = texto3;
            informacion.descripcion = descripcion;

        if(req.files !== undefined){

            if(req.files['imagenes']){
                await Promise.all(
                    req.files['imagenes'].map( async imagen => {
                        const imagenNueva = await subirImagen(imagen);
                        if(imagenNueva){
                            imagenes.push(imagenNueva);
                        }
                    })
                )
            }

            if(req.files['imagen']){
                const imagenNueva = await subirImagen(req.files['imagen'][0]);
                if(imagenNueva){
                    informacion.imagen = imagenNueva;
                    if(imagenBaja) eliminarImagen(imagenBaja);
                }
            }
        }

        informacion.imagenes = imagenes;
        
        const nosotros = await Nosotros.findByIdAndUpdate({_id},informacion,{new:true})
        return res.json({nosotros});

        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Error al actualizar el contenido'})
    }
}

exports.eliminarSeccionNosotros = async (req,res) => {
    try {

        const nosotros = await Nosotros.findById({_id:req.params.id});

        await Promise.all(
            nosotros.imagenes.map( async item => {
                await eliminarImagen(item);
            })
        )

        await eliminarImagen(nosotros.imagen);

        await Nosotros.findByIdAndDelete({_id:req.params.id});
        res.json({msg:'Elemento eliminado correctamente'})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Error al eliminar el contenido'})
    }
}

exports.obtenerSeccionNosotros = async (req,res) => {
    try {

        const nosotros = await Nosotros.find();
        res.json({nosotros});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Error al obtener el contenido'})
    }
}

exports.eliminarImagenes = async (req,res) => {
    try {

        let nuevoProducto = {};
        nuevoProducto.imagenes = req.body.listado;
        await Nosotros.findByIdAndUpdate({_id:req.body._id},nuevoProducto,{new:true});
        await eliminarImagen(req.body.imagen);
        res.json({msg:'Imagen eliminada'})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Error al obtener el contenido'});
    }
}