const MetodosPago = require('../models/MetodosPago');

exports.crearMetodoPago = async (req,res) => {
    try {

        const { nombre } = req.body;

        let nuevoMetodo = {};
        nuevoMetodo.nombre = nombre;

        const metodo = new MetodosPago(nuevoMetodo);
        await metodo.save();

        res.json({metodo});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Ha ocurrido un error al crear el metodo de pago'
        })
    }
}

exports.editarMetodoPago = async (req,res) => {
    try {

        const { nombre,_id } = req.body;

        let nuevoMetodo = {};
        nuevoMetodo.nombre = nombre;

        const metodo = await MetodosPago.findByIdAndUpdate({_id},nuevoMetodo,{new:true})
        res.json({metodo});
        
    } catch (error) {
        res.status(500).json({
            msg:'Ha ocurrido un error al editar el metodo de pago'
        })
    }
}

exports.eliminarMetodoPago = async (req,res) => {
    try {

        await MetodosPago.findByIdAndDelete({_id:req.params.id});
        res.json({msg:'Metodo de pago eliminado correctamente'});
        
    } catch (error) {
        res.status(500).json({
            msg:'Ha ocurrido un error al eliminar el metodo'
        })
    }
}

exports.obtenerMetodosPago = async (req,res) => {
    try {

        const metodos = await MetodosPago.find();
        res.json({metodos});
        
    } catch (error) {
        res.status(500).json({
            msg:'Ha ocurrido un error al obtener los metodos de pago'
        })
    }
}