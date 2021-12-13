const Almacenes = require('../models/Almacenes');
const Usuario = require('../models/Usuarios');
const Productos = require('../models/Productos');

exports.crearAlmacen = async (req,res) => {
    try {

        const { encargado,nombre } = req.body;

        let nuevoAlmacen = {};

        nuevoAlmacen.encargado = encargado;
        nuevoAlmacen.nombre = nombre;

        const almacen = new Almacenes (nuevoAlmacen);

        await almacen.save();

        return res.json({msg:'Almacen creado correctamente'});

    } catch (error) {
        
        console.log(error);

        return res.status(400).json({msg:'Ha ocurrido un error al crear el almacen'});

    }
}

exports.editarAlmacen = async (req,res) => {
    try {

        const { encargado,nombre,_id } = req.body;

        let nuevoAlmacen = {};

        nuevoAlmacen.encargado = encargado;
        nuevoAlmacen.nombre = nombre;

        const almacen = await Almacenes.findByIdAndUpdate({_id},nuevoAlmacen,{new:true});

        console.log(almacen);

        return res.json({almacen});

    } catch (error) {

        console.log(error);
        
        return res.status(400).json({msg:'Ha ocurrido un error al editar el almacen'});

    }
}

exports.eliminarAlmacen = async (req,res) => {
    try {
        
        const {_id} = req.params;
        
        await Almacenes.findByIdAndDelete({_id});

        return res.json({msg:'Almacen eliminado correctamente'})

    } catch (error) {
        return res.status(400).json({msg:'Ha ocurrido un error al eliminar el almacen'});
    }
}

exports.obtenerAlmacenes = async (req,res) => {
    try {
        
        const resultados = await Almacenes.find();

        const almacenes = await Promise.all(
            resultados.map(async result => {

                const almacen = JSON.parse(JSON.stringify(result));

                const usuario = await Usuario.findById({_id:result.encargado});

                if(usuario){
                    almacen.nombreEncargado = usuario.nombre;
                }else{
                    almacen.nombreEncargado = 'Undefined';
                }

                return almacen

            })
        )

        return res.json({almacenes});

    } catch (error) {
        return res.status(400).json({msg:'Error al obtener los almacenes'});
    }
}