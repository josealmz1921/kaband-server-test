const mongoose = require('mongoose');

const CotizacionesSchema = mongoose.Schema({
    cliente:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Clientes'
    },
    vendedor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Usuario'
    },
    nota:{
        type:String
    },
    total:{
        type:Number
    },
    informacion:{
        type:Object
    },
    status:{
        type:String,
        default:'Activa'
    },
    descuento:{
        type:Number
    },
    divisa:{
        type:String,
    },
    comentarios:{
        type:String
    },
    fecha:{
        type:Date,
        default:Date.now()
    },
    envio:{
        type:Number
    }
})

module.exports = mongoose.model('Cotizaciones',CotizacionesSchema);