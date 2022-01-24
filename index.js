const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

// crear el servidor
const app = express();

// Conectar a la base de datos
conectarDB();

// Hablitar express.json
app.use(express.json({extend:true,limit: '50mb'}));
 
// Habilitar cors

app.use(cors());

// puerto de la app
const PORT = process.env.PORT || 4000;


// Importar rutas

app.use('/api/auth',require('./routes/auth'));
app.use('/api/clientes',require('./routes/clientes'));
app.use('/api/categorias',require('./routes/categorias'));
app.use('/api/almacenes',require('./routes/almacenes'));
app.use('/api/productos',require('./routes/productos'));
app.use('/api/roles',require('./routes/roles'));
app.use('/api/usuarios',require('./routes/usuarios'));
app.use('/api/venta',require('./routes/ventas'));
app.use('/api/cotizacion',require('./routes/cotizaciones'));
app.use('/api/reportes',require('./routes/reportes'));
app.use('/api/paginas',require('./routes/paginas'));
app.use('/api/carrito',require('./routes/carrito'));
app.use('/api/inventarios',require('./routes/inventarios'));
app.use('/api/sectores',require('./routes/sectores'));
app.use('/api/metodos',require('./routes/metosPago'));

// arrancar app
app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
})

