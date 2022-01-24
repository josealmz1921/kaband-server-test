const mongoose = require('mongoose');

const MetodosPagoSchema = mongoose.Schema({
    nombre:{
        type:String
    }
})

module.exports = mongoose.model('MetodosPago',MetodosPagoSchema); 