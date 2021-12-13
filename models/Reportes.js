const mongoose = require('mongoose');

const ReportesSchema = mongoose.Schema({
    remision:{
        type:Number
    },
    concepto:{
        type:String
    },
    sector:{
        type:String
    },
    divisa:{
        type:String
    },
    fechaPago:{
        type:Date
    },
    estatus:{
        type:String
    },
    formaPago:{
        type:String
    },
    precio:{
        type:Number
    },
    cantidad:{
        type:Number
    },
    descuento:{
        type:Number
    },
    categoria:{
        type:String
    },
    cliente:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Clientes'
    },
    producto:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Producto'
    },
    vendedor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Usuarios',
    },
    venta:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Ventas',
    }
})

module.exports = mongoose.model('Reportes',ReportesSchema);