const Contacto = require('../models/Contacto');
const Privacidad = require('../models/Privacidad');
const Terminos = require('../models/Terminos');
const { sendMailContacto } = require('../functions/sendEmail')

exports.editarContacto = async (req,res) => {
    try {
        
        const { nosotros,whatsapp,telefono,email,direccion,horarios,facebook,instagram,youtube,copy,nosotrosCorto } = req.body;

        let nuevosContactos = {};
        nuevosContactos.nosotros = nosotros;
        nuevosContactos.whatsapp = whatsapp;
        nuevosContactos.telefono = telefono;
        nuevosContactos.email = email;
        nuevosContactos.direccion = direccion;
        nuevosContactos.horarios = horarios;
        nuevosContactos.facebook = facebook;
        nuevosContactos.instagram = instagram;
        nuevosContactos.youtube = youtube;
        nuevosContactos.copy = copy;
        nuevosContactos.nosotrosCorto = nosotrosCorto;

        const contacto = await Contacto.findByIdAndUpdate({_id:'61a6315dab5aa8958a4eecc0'},nuevosContactos,{new:true})
        res.json({contacto});

    } catch (error) {
        res.status(500).json({msg:'Error al editar el contenido'});
    }

}

exports.obtenerContactos = async (req,res) => {
    try {

        const contacto = await Contacto.findById({_id:'61a6315dab5aa8958a4eecc0'});
        res.json({contacto});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Ha ocurrido un error al obtener la informacion de contacto'})
    }
}

exports.editarPrivacidad = async (req,res) => {
    try {
        
        const { privacidad } = req.body;

        let nuevaPrivacidad = {};
        nuevaPrivacidad.privacidad = privacidad;

        const privacidadNew = await Privacidad.findByIdAndUpdate({_id:'61a639a702fb0365f955c2a7'},nuevaPrivacidad,{new:true})
        res.json({privacidadNew});

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Error al editar el contenido'});
    }

}

exports.obtenerPrivacidad = async (req,res) => {
    try {

        const privacidad = await Privacidad.findById({_id:'61a639a702fb0365f955c2a7'});
        res.json({privacidad});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Ha ocurrido un error al obtener la informacion de contacto'})
    }
}

exports.editarTerminos = async (req,res) => {
    try {
        
        const { terminos } = req.body;

        let nuevaTerminos = {};
        nuevaTerminos.terminos = terminos;

        const nuevaterminos = await Terminos.findByIdAndUpdate({_id:'61a6437d0e6fd5de604d8865'},nuevaTerminos,{new:true})
        res.json({nuevaterminos});

    } catch (error) {
        res.status(500).json({msg:'Error al editar el contenido'});
    }

}

exports.obtenerTerminos = async (req,res) => {
    try {

        const terminos = await Terminos.findById({_id:'61a6437d0e6fd5de604d8865'});
        res.json({terminos});
        
    } catch (error) {
        res.status(500).json({msg:'Ha ocurrido un error al obtener la informacion de contacto'})
    }
}

exports.enviarContacto = async (req,res) => {
    try {

        await sendMailContacto(req.body);

        res.json({msg:'Formulario enviado correctamente'})
        
    } catch (error) {
        res.status(500).json({msg:'Ha ocurrido un error al eviar el formulario'})
    }
}
