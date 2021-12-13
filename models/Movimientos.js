const mongoose = require('mongoose');

const MovimientosSchema = mongoose.Schema({
    producto:{
        type:String
    },
    productoId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Productos'
    },
    almacenes:{
        type:Array
    },
    usuario:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Usuarios',
        default:null
    },
    fecha:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model('Movimientos',MovimientosSchema);