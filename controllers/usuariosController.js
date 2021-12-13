const Usuarios = require('../models/Usuarios');
const bcryptjs = require('bcryptjs');
const Roles = require('../models/Roles');

exports.crearUsuario = async (req,res) => {
    try {

        const { nombre,email,telefono,rol,_id } = req.body;

        let nuevoUsuario = {};

        nuevoUsuario.nombre = nombre;
        nuevoUsuario.email = email;
        nuevoUsuario.telefono = telefono;
        nuevoUsuario.rol = rol;
        const salt = await bcryptjs.genSalt(10);
        const newPass = await bcryptjs.hash(req.body.password, salt);

        nuevoUsuario.password = newPass;

        const usuario = new Usuarios (nuevoUsuario);
        usuario.save();
        return res.json({msg:'Usuario creado correctamente'});

    } catch (error) {
        
        return res.status(400).json({msg:'Ha ocurrido un error al crear el almacen'});

    }
}

exports.editarUsuario = async (req,res) => {
    try {

        const { nombre,email,telefono,rol,_id } = req.body;

        let nuevoUsuario = {};

        nuevoUsuario.nombre = nombre;
        nuevoUsuario.email = email;
        nuevoUsuario.telefono = telefono;
        nuevoUsuario.rol = rol;

        if(req.body.password.trim() !== ''){

            const salt = await bcryptjs.genSalt(10);
            const newPass = await bcryptjs.hash(req.body.password, salt);

            nuevoUsuario.password = newPass;
        }

        const usuario = await Usuarios.findByIdAndUpdate({_id},nuevoUsuario,{new:true});

        return res.json({usuario});

    } catch (error) {

        console.log(error);
        
        return res.status(400).json({msg:'Ha ocurrido un error al editar el usuario'});

    }
}

exports.eliminarUsuario = async (req,res) => {
    try {
        const {_id} = req.params;
        await Usuarios.findByIdAndDelete({_id});
        return res.json({msg:'Usuario eliminado correctamente'})
    } catch (error) {
        return res.status(400).json({msg:'Ha ocurrido un error al eliminar el almacen'});
    }
}

exports.obtenerUsuarios = async (req,res) => {
    try {
        
        const { page } = req.params;

        const skip = (page - 1) * 25;
        const users = await Usuarios.find().limit(25).skip(skip);
        const total = await Usuarios.find().count();

        const usuarios = await Promise.all(
            users.map(async user => {

                const rol = await Roles.findById({_id:user.rol})

                let usuario = JSON.parse(JSON.stringify(user));

                usuario.password = '';

                if(rol){
                    usuario.nombreRol = rol.nombre;
                }else{
                    usuario.nombreRol = 'Undefined';
                }

                return usuario;
                

            })
        );

        return res.json({usuarios,total});

    } catch (error) {
        console.log(error);
        return res.status(400).json({msg:'Error al obtener los almacenes'});
    }
}

exports.obtenerUsuariosAll = async (req,res) => {
    try {
        
        const usuarios = await Usuarios.find();
        return res.json({usuarios});

    } catch (error) {
        console.log(error);
        return res.status(400).json({msg:'Error al obtener los almacenes'});
    }
}