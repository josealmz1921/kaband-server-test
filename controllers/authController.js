const Usuario = require('../models/Usuarios');
const bcryptjs = require('bcryptjs');
const Roles = require('../models/Roles');
const jwt = require('jsonwebtoken');


exports.autenticarUsuario = async (req,res) => {


    // Extraer email y password
    const {usuario,password} = req.body;

    try {
        
        // Revisar usuario registrado
        let user = await Usuario.findOne({ email:usuario });

        if(!user){
            return res.status(400).json({msg:'El usuario no existe'})
        }

        // Revisar password
        const passCorrecto = await bcryptjs.compare(password,user.password);
        if(!passCorrecto){
            return res.status(400).json({msg:'Password incorrecto'})
        }

        // Si todo es correcto crear y firmar el JWT

        const payload = {
            usuario:{
                id:user._id
            }
        };

        const usuarioSend = await Usuario.findById(user._id).select('-password');
        const rol = await Roles.findOne({_id:usuario.rol});

        // Firmar JWT
        jwt.sign(payload,process.env.SECRETEA,{
            expiresIn:86400//1 dia
        },(error,token)=>{
            if(error) throw error;
            // Mensaje de confirmacion
             res.json({token,usuario:usuarioSend,rol});
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({msg:'Error al iniciar sesion'})
    }

}

// Obtine que usuario esta autenticado
exports.usuarioAutenticado = async (req,res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        const rol = await Roles.findOne({_id:usuario.rol});
        res.json({usuario,rol})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Hubo un error al iniciar sesion'})
    }
}

exports.cambiarUsuario = async (req,res) => {
    try {

        const {usuario,_id} = req.body;

        const validarUsuario = Usuario.findOne({usuario});

        if(!validarUsuario && validarUsuario._id != _id){
            return res.status(400).json({msg:'Este usuario ya esta registrado'});
        }

        const usuarioNuevo = await Usuario.findOneAndUpdate({_id:_id},{$set:{usuario}})
        console.log(usuarioNuevo);
        res.json({usuarioNuevo})
        
    } catch (error) {
        res.status(400).json({msg:'Error al editar el usuario'});
    }
}

exports.cambiarPassword = async (req,res) => {
    try {
        const {password,usuario} = req.body;
        const salt = await bcryptjs.genSalt(10);
        const newPass = await bcryptjs.hash(password, salt);
        await Usuario.findOneAndUpdate({_id:usuario},{$set:{password:newPass}});
        res.json({msg:'Contraseña cambiada correctamente'})
        
    } catch (error) {
        console.log(error);
        res.status(400).json({msg:'Error al cambiar la contraseña'});
    }
}