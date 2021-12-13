const mongoose = require('mongoose');

const PrivacidadSchema = mongoose.Schema({
    privacidad:{
        type:String
    }
})

module.exports = mongoose.model('Privacidad',PrivacidadSchema);