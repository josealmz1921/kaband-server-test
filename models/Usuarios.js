const mongoose = require('mongoose');

const UsuariosSchema = mongoose.Schema({
    nombre:{
        type:String
    },
    email:{
        type:String
    },
    telefono:{
        type:String
    },
    password:{
        type:String
    },
    status:{
        type:Boolean,
        default:true
    },
    rol:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Roles'
    },
})

module.exports = mongoose.model('Usuarios',UsuariosSchema);