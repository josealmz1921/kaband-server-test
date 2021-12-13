const Roles = require('../models/Roles');
const Usuarios = require('../models/Usuarios');

exports.crearRol = async (req,res) => {
    try {

        const rol = new Roles (req.body);
        await rol.save();
        return res.json({msg:'Rol creado correctamente'});

    } catch (error) {
        
        return res.status(400).json({msg:'Ha ocurrido un error al crear el almacen'});

    }
}

exports.editarRol = async (req,res) => {
    try {

        const { nombre,tipo,datos,accesos,visualizar,_id } = req.body;

        let nuevoRol = {};

        nuevoRol.tipo = tipo;
        nuevoRol.nombre = nombre;
        nuevoRol.visualizar = visualizar;
        nuevoRol.datos = datos;
        nuevoRol.accesos = accesos;
        nuevoRol.actualizacion = Date.now();

        const rol = await Roles.findByIdAndUpdate({_id},nuevoRol,{new:true});

        return res.json({rol});

    } catch (error) {

        console.log(error);
        
        return res.status(400).json({msg:'Ha ocurrido un error al editar el rol'});

    }
}

exports.eliminarRol = async (req,res) => {
    try {
        
        const {_id} = req.params;

        const validarRol = await Usuarios.findOne({rol:_id});

        if(validarRol){
            return res.status(400).json({msg:'No se puede eliminar un rol si esta asignado a un usuario'});
        }
        
        await Roles.findByIdAndDelete({_id});

        return res.json({msg:'Rol eliminado correctamente'})

    } catch (error) {
        return res.status(400).json({msg:'Ha ocurrido un error al eliminar el almacen'});
    }
}

exports.obtenerRoles = async (req,res) => {
    try {
        
        const { page } = req.params;

        const skip = (page - 1) * 25;
        const roles = await Roles.find().limit(25).skip(skip);
        const total = await Roles.find().count();

        return res.json({roles,total});

    } catch (error) {
        // console.log(error);
        return res.status(400).json({msg:'Error al obtener los roles'});
    }
}

exports.obteneAllRoles = async (req,res) => {
    try {
        
        const roles = await Roles.find();
        return res.json({roles});

    } catch (error) {
        console.log(error);
        return res.status(400).json({msg:'Error al obtener los roles 1'});
    }
}

exports.obtenerRol = async (req,res) => {
    try {

        const rol = await Roles.findOne({_id:req.params._id})
        return res.json({rol});

    } catch (error) {
        return res.status(400).json({msg:'Error al obtener los roles'});
    }
}

