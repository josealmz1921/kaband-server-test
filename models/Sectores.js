const mongoose = require('mongoose');

const SectoresSchema = mongoose.Schema({
    nombre:{
        type:String
    }
})

module.exports = mongoose.model('Sectores',SectoresSchema); 