const mongoose = require('mongoose');

const SeccionCategoriasDestacadasSchema = mongoose.Schema({
    imagen:{
        type:String
    },
    categoria:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Categorias'
    },
})

module.exports = mongoose.model('SeccionCategoriasDestacadas',SeccionCategoriasDestacadasSchema);