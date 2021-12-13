const mongoose = require('mongoose');

const CategoriasSchema = mongoose.Schema({
    nombre:{
        type:String
    },
    padre:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Categorias'
    },
})

module.exports = mongoose.model('Categorias',CategoriasSchema);