const mongoose = require('mongoose');

const FondosSchema = mongoose.Schema({
    imagen1:{
        type:String
    },
    imagen2:{
        type:String
    },
    imagen3:{
        type:String
    },
    imagen4:{
        type:String
    },
    imagen5:{
        type:String
    },
})

module.exports = mongoose.model('Fondos',FondosSchema);