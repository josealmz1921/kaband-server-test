const Fondos = require('../models/Fondos');
const {subirImagen} = require('../functions/subirImagen');
const {eliminarImagen} = require('../functions/eliminarImagen');

exports.editarFondos = async (req,res) => {
    try {

        let error = '';

        const imagenes = await Fondos.findById({_id:'61d8b343736b02bda4888385'});
        let nuevasImagenes = {};
        
        if(req.files['imagen1']){
            const imagenNueva = await subirImagen(req.files['imagen1'][0]);
            if(imagenNueva){
                nuevasImagenes.imagen1 = imagenNueva;
                imagenes.imagen1 ? eliminarImagen(imagenes.imagen1) : null;
            }else{
                error = `${error} \n No se ha podido subir la imagen grande.`;
            }
        }

        if(req.files['imagen2']){
            const imagenNueva = await subirImagen(req.files['imagen2'][0]);
            if(imagenNueva){
                nuevasImagenes.imagen2 = imagenNueva;
                imagenes.imagen2 ? eliminarImagen(imagenes.imagen2) : null ;
            }else{
                error = `${error} \n No se ha podido subir la imagen 1.`;
            }
        }

        if(req.files['imagen3']){
            const imagenNueva = await subirImagen(req.files['imagen3'][0]);
            if(imagenNueva){
                nuevasImagenes.imagen3 = imagenNueva;
                imagenes.imagen3 ? eliminarImagen(imagenes.imagen3) : null;
            }else{
                error = `${error} \n No se ha podido subir la imagen 2.`;
            }
        }

        if(req.files['footer1']){
            const imagenNueva = await subirImagen(req.files['footer1'][0]);
            if(imagenNueva){
                nuevasImagenes.imagen4 = imagenNueva;
                imagenes.imagen4 ? eliminarImagen(imagenes.imagen4) : null;
            }else{
                error = `${error} \n No se ha podido subir la imagen 2.`;
            }
        }

        if(req.files['footer2']){
            const imagenNueva = await subirImagen(req.files['footer2'][0]);
            if(imagenNueva){
                nuevasImagenes.imagen5 = imagenNueva;
                imagenes.imagen5 ? eliminarImagen(imagenes.imagen5) : null;
            }else{
                error = `${error} \n No se ha podido subir la imagen 2.`;
            }
        }


        await Fondos.findByIdAndUpdate({_id:'61d8b343736b02bda4888385'},nuevasImagenes,{new:true})

        if(error.length > 0){
            res.status(400).json({msg:error})
        }else{
            res.json({msg:'Contenido actualizado correctamente'})
        }


    } catch (error) {
        console.log(error);
        res.status(400).json({msg:'Error al subir la(s) imagenes'})
    }
}


exports.obtenerFondos = async (req,res) => {
    try {

        const fondos = await Fondos.findById({_id:'61d8b343736b02bda4888385'});
        res.json(fondos);
        
    } catch (error) {
        res.status(500).json({msg:'Error'})
    }
}