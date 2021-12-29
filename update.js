const conectarDB = require('./config/db');
const Clientes = require('./models/Clientes');
const Productos = require('./models/Productos');

conectarDB();

const updateFunction = async () => {
    await Productos.updateMany({},{$set:{
        accesorios:[]
    }})
}

updateFunction();