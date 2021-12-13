const mongoose = require('mongoose');

const AlmacenesSchema = mongoose.Schema({
    nombre:{
        type:String
    },
    encargado:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Categorias'
    },
})

module.exports = mongoose.model('Almacenes',AlmacenesSchema);