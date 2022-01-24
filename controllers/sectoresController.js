const Sectores = require('../models/Sectores');

exports.crearSector = async (req,res) => {
    try {

        const { nombre } = req.body;

        let nuevoSector = {};
        nuevoSector.nombre = nombre;

        const sector = new Sectores(nuevoSector);
        await sector.save();

        res.json({sector});
        
    } catch (error) {
        res.status(500).json({
            msg:'Ha ocurrido un error al crear el sector'
        })
    }
}

exports.editarSector = async (req,res) => {
    try {

        const { nombre,_id } = req.body;

        let nuevoSector = {};
        nuevoSector.nombre = nombre;

        const sector = await Sectores.findByIdAndUpdate({_id},nuevoSector,{new:true})
        res.json({sector});
        
    } catch (error) {
        res.status(500).json({
            msg:'Ha ocurrido un error al editar el sector'
        })
    }
}

exports.eliminarSector = async (req,res) => {
    try {

        await Sectores.findByIdAndDelete({_id:req.params.id});
        res.json({msg:'Sector eliminado correctamente'});
        
    } catch (error) {
        res.status(500).json({
            msg:'Ha ocurrido un error al eliminar el sector'
        })
    }
}

exports.obtenerSectores = async (req,res) => {
    try {

        const sectores = await Sectores.find();
        res.json({sectores});
        
    } catch (error) {
        res.status(500).json({
            msg:'Ha ocurrido un error al obtener los sectores'
        })
    }
}