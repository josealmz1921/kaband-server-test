const mongoose = require('mongoose');

const SeccionVideoSchema = mongoose.Schema({
    titulo:{
        type:String
    },
    subtitulo:{
        type:String
    },
    descripcion:{
        type:String
    },
    video:{
        type:String
    }
})

module.exports = mongoose.model('SeccionVideo',SeccionVideoSchema);