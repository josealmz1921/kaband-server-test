const mongoose = require('mongoose');

const ClienteSchema = mongoose.Schema({
    empresa:{
        type:String
    },
    contacto:{
        type:String
    },
    telefono:{
        type:String
    },
    celular:{
        type:String
    },
    email:{
        type:String
    },
    sector:{
        type:String,
    },
    facturacionStatus:{
        type:Boolean,
    },
    razonSocial:{
        type:String,
    },
    rfc:{
        type:String,
    },
    calle:{
        type:String,
    },
    colonia:{
        type:String,
    },
    nroInterior:{
        type:String,
    },
    nroExterior:{
        type:String,
    },
    ciudad:{
        type:String,
    },
    estado:{
        type:String,
    },
    codigoPostal:{
        type:String,
    },
    vendedor:{
        type:mongoose.Schema.Types.ObjectId,
        default:null,
        ref:'Usuarios'
    },
    registrado:{
        type : Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Cliente',ClienteSchema);