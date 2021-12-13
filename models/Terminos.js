const mongoose = require('mongoose');

const TerminosSchema = mongoose.Schema({
    terminos:{
        type:String
    }
})

module.exports = mongoose.model('Terminos',TerminosSchema);