const mongoose = require('mongoose');

const SeccionSobreNosotrosSchema = mongoose.Schema({
    imagenGrande:{
        type:String
    },
    imagen1:{
        type:String
    },
    imagen2:{
        type:String
    },
    listado:{
        type:Array
    }
})

module.exports = mongoose.model('SeccionSobreNosotros',SeccionSobreNosotrosSchema);