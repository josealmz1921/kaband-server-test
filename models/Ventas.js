const mongoose = require('mongoose');

const VentasSchema = mongoose.Schema({
    vendedor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Usuario',
        default:null
    },
    cliente:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Clientes'
    },
    nota:{
        type:Number,
    },
    total:{
        type:Number
    },
    informacion:{
        type:Object
    },
    status:{
        type:String
    },
    formaPago:{
        type:String,
        default:null
    },
    divisa:{
        type:String,
    },
    descuento:{
        type:Number
    },
    fecha:{
        type:Date,
        default:Date.now()
    },
    envio:{
        type:Number
    }
})

module.exports = mongoose.model('Ventas',VentasSchema);