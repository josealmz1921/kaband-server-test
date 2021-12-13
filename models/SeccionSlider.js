const mongoose = require('mongoose');

const SeccionSliderSchema = mongoose.Schema({
    imagen:{
        type:String
    },
    texto1:{
        type:String
    },
    texto2:{
        type:String
    },
    texto3:{
        type:String
    },
    position:{
        type:String
    }
})

module.exports = mongoose.model('SeccionSlider',SeccionSliderSchema);