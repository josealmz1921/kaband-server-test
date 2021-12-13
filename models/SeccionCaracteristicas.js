const mongoose = require('mongoose');

const SeccionCaracteristicasSchema = mongoose.Schema({
    imagen:{
        type:String
    },
    titulo:{
        type:String
    },
    descripcion:{
        type:String
    }
})

module.exports = mongoose.model('SeccionCaracteristicas',SeccionCaracteristicasSchema);