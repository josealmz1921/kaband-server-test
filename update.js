const conectarDB = require('./config/db');
const Clientes = require('./models/Clientes');
const Productos = require('./models/Productos');
const Almacenes = require('./models/Almacenes');

conectarDB();

const updateFunction = async () => {

    const productos = await Productos.find();
    
    await Promise.all(
        await productos.map(async producto => {

            let mostrar = false;

            const product = JSON.parse(JSON.stringify(producto));

            let almacenes = product.almacenes;

            const nuevosAlmacenes = almacenes.map(almacen => {
                if(almacen.nombre === 'U-storahe'){
                    mostrar = true;
                    almacen.nombre = 'U-storage'
                }
                return almacen;
            })

            product.almacenes = nuevosAlmacenes;

            await Productos.findByIdAndUpdate({_id:product._id},product,{new:true});

        })
    )

    console.log('Actualizado correctamente');

    // await Productos.updateMany({},{$set:{
    //     imagenesColores:[],
    //     colores:[],
    //     vinculados:[]
    // }})
}

updateFunction();