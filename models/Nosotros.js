const mongoose = require('mongoose');

const NosotrosSchema = mongoose.Schema({
    imagenes:{
        type:Array
    },
    imagen:{
        type:String,
        default:null
    },
    posicion:{
        type:String
    },
    descripcion:{
        type:String
    },
    texto1:{
        type:String
    },
    texto2:{
        type:String
    },
    texto3:{
        type:String
    }
})

module.exports = mongoose.model('Nosotros',NosotrosSchema);