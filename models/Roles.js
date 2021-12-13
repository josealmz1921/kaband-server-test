const mongoose = require('mongoose');

const RolesSchema = mongoose.Schema({
    nombre:{
        type:String
    },
    visualizar:{
        type:String
    },
    datos:{
        type:Number
    },
    accesos:{
        type:Object
    },
    creacion:{
        type:Date,
        default:Date.now()
    },
    actualizacion:{
        type:Date,
        default:null
    }
})

module.exports = mongoose.model('Roles',RolesSchema);