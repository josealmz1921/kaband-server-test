const Productos = require('../models/Productos');

exports.leerExcel = async (req,res) => {
    try {

        await Promise.all(
            await req.body.map(async item => {

                const producto = await Productos.findById({_id:item.id});
                
                const almacen = producto.almacenes.map(almacen => {
                    // Obteniendo la cantidad del almacen por nombre
                    let cant = Number(item[almacen.nombre]);
                    if (isNaN(cant)) {
                        cant = almacen.cantidad
                    }
                    almacen.cantidad = cant;
                    return almacen;
                })

                const result = await Productos.findByIdAndUpdate({_id:item.id},
                {$set:{
                    nombre:item.Nombre,
                    sku:item.Sku,
                    precio:Number(item['Precio Compra']),
                    precioVenta:Number(item['Precio Venta']),
                    almacenes:almacen
                }});
                
            })
        )

        res.json({msg:'Productos actualizados'})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Ha ocurrido un error al leer el contenidd'})
    }
}