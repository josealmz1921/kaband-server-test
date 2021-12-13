const conectarDB = require('./config/db');
const Clientes = require('./models/Clientes');
const Productos = require('./models/Productos');

conectarDB();

const updateFunction = async () => {
    await Productos.updateMany({},{$set:{
        peso:0,
        largo:0,
        alto:0,
        ancho:0,
        imagenes:[]
    }})
}

updateFunction();