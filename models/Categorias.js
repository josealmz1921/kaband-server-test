const mongoose = require('mongoose');

const CategoriasSchema = mongoose.Schema({
    nombre:{
        type:String
    },
    imagenMenu:{
        type:String,
        default:null
    },
    imagen:{
        type:String,
        default:null
    },
    padre:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Categorias'
    },
})

module.exports = mongoose.model('Categorias',CategoriasSchema);