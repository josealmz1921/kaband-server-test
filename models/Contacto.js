const mongoose = require('mongoose');

const ContactoSchema = mongoose.Schema({
    nosotros:{
        type:String
    },
    whatsapp:{
        type:String
    },
    telefono:{
        type:String
    },
    email:{
        type:String
    },
    direccion:{
        type:String
    },
    horarios:{
        type:String
    }
})

module.exports = mongoose.model('Contacto',ContactoSchema);