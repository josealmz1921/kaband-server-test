const mongoose = require('mongoose');

const SeccionProductosDestacadosSchema = mongoose.Schema({
    producto:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Productos'
    }
})

module.exports = mongoose.model('SeccionProductosDestacados',SeccionProductosDestacadosSchema);