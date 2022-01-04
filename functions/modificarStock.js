const Productos = require('../models/Productos');
const Clientes = require('../models/Clientes');
const Reportes = require('../models/Reportes');
const Movimientos = require('../models/Movimientos');


exports.validarStock = async (productos) => {

    const validacion = await Promise.all(
        await productos.map( async producto => {

            const productoFind = await Productos.findById({_id:producto._id});
            const almacenDesc = productoFind.almacenes.filter(almacen => almacen.id === producto.almacen);
            const nuevaCantidadAlmacen = Number(almacenDesc[0].cantidad) - producto.cantidadVenta;

            return nuevaCantidadAlmacen;

        })
    )

    return validacion;

}

exports.descontarStock = async (productos,usuario) => {

    await Promise.all(

        await productos.map( async producto => {

            const productoFind = await Productos.findById({_id:producto._id});
            const almacenDesc = productoFind.almacenes.filter(almacen => almacen.id === producto.almacen);
            const nuevaCantidadAlmacen = Number(almacenDesc[0].cantidad) - producto.cantidadVenta;
            const almacenesProducto = productoFind.almacenes;

            let nuevoMovimiento = {};
            let almacenesList = almacenesProducto.map(almacen => {
                let datos = {};
                if(almacen.id == producto.almacen){
                    datos.almacen = almacen.id;
                    datos.despues = parseInt(nuevaCantidadAlmacen);
                    datos.antes = parseInt(almacen.cantidad);
                    datos.tipo = 'vendido';
                }else{
                    datos.almacen = almacen.id;
                    datos.despues = parseInt(almacen.cantidad);
                    datos.antes = parseInt(almacen.cantidad);
                    datos.tipo = 'vendido';
                }
                    
                return datos;
            })
            

            nuevoMovimiento.almacenes = almacenesList;
            nuevoMovimiento.producto = productoFind.nombre;
            nuevoMovimiento.productoId = producto._id;
            nuevoMovimiento.usuario = usuario;
            const movimiento = new Movimientos(nuevoMovimiento);
            await movimiento.save();

            const nuevosAlmacenes = productoFind.almacenes.map( almacen => {
                if(almacen.id === producto.almacen){
                    almacen.cantidad = nuevaCantidadAlmacen;
                }
                return almacen;
            });

            await Productos.findByIdAndUpdate({_id:producto._id},{
                $set:{
                    almacenes:nuevosAlmacenes
                }
            })

        })
    )

}

exports.descontarStockOnline = async (productos) => {

    await Promise.all(

        await productos.map( async producto => {
            

            const productoColor = producto.vinculados.find(item => item.color === producto.color);

            const productoFind = await Productos.findById({_id:productoColor.id});
            const almacenDesc = productoFind.almacenes.filter(almacen => almacen.id === 0);
            console.log(productoFind);
            const nuevaCantidadAlmacen = Number(almacenDesc[0].cantidad) - producto.cantidad;
            const almacenesProducto = productoFind.almacenes;

            let nuevoMovimiento = {};
            let almacenesList = almacenesProducto.map(almacen => {
                let datos = {};
                if(almacen.id == 0){
                    datos.almacen = 0;
                    datos.despues = parseInt(nuevaCantidadAlmacen);
                    datos.antes = parseInt(almacen.cantidad);
                    datos.tipo = 'vendido';
                }else{
                    datos.almacen = almacen.id;
                    datos.despues = parseInt(almacen.cantidad);
                    datos.antes = parseInt(almacen.cantidad);
                    datos.tipo = 'vendido';
                }
                    
                return datos;
            })
            

            nuevoMovimiento.almacenes = almacenesList;
            nuevoMovimiento.producto = productoFind.nombre;
            nuevoMovimiento.productoId = productoColor.id;
            nuevoMovimiento.usuario = null;
            const movimiento = new Movimientos(nuevoMovimiento);
            await movimiento.save();

            const nuevosAlmacenes = productoFind.almacenes.map( almacen => {
                if(almacen.id === 0){
                    almacen.cantidad = nuevaCantidadAlmacen;
                }
                return almacen;
            });

            console.log(nuevosAlmacenes,nuevaCantidadAlmacen);

            await Productos.findByIdAndUpdate({_id:productoColor.id},{
                $set:{
                    almacenes:nuevosAlmacenes
                }
            })

        })
    )

}

exports.devolverStock = async (productos,usuario) => {

    await Promise.all(
        await productos.map( async producto => {

            const productoFind = await Productos.findById({_id:producto._id});
            const almacenDesc = productoFind.almacenes.filter(almacen => almacen.id === producto.almacen);
            const nuevaCantidadAlmacen = Number(almacenDesc[0].cantidad) + Number(producto.cantidadVenta);
            const almacenesProducto = productoFind.almacenes;

            let nuevoMovimiento = {};
            let almacenesList = almacenesProducto.map(almacen => {
                let datos = {};
                if(almacen.id == producto.almacen){
                    datos.almacen = almacen.id;
                    datos.despues = parseInt(nuevaCantidadAlmacen);
                    datos.antes = parseInt(almacen.cantidad);
                    datos.tipo = 'devuelto';
                }else{
                    datos.almacen = almacen.id;
                    datos.despues = parseInt(almacen.cantidad);
                    datos.antes = parseInt(almacen.cantidad);
                    datos.tipo = 'devuelto';
                }
                    
                return datos;
            })
            

            nuevoMovimiento.almacenes = almacenesList;
            nuevoMovimiento.producto = productoFind.nombre;
            nuevoMovimiento.productoId = producto._id;
            nuevoMovimiento.usuario = usuario;
            const movimiento = new Movimientos(nuevoMovimiento);
            await movimiento.save();

            const nuevosAlmacenes = productoFind.almacenes.map( almacen => {
                if(almacen.id === producto.almacen){
                    almacen.cantidad = parseInt(nuevaCantidadAlmacen);
                }
                return almacen;
            });

            await Productos.findByIdAndUpdate({_id:producto._id},{
                $set:{
                    almacenes:nuevosAlmacenes
                }
            })

        })
    )

}

exports.guardarDatosReporte = async (productos,vendedor,cliente,total,formaPago,divisa,estatus,noNota,venta) => {

    await Promise.all(
        await productos.map( async producto => {

            const productoFind = await Productos.findById({_id:producto._id});
            const clienteFind = await Clientes.findById({_id:cliente});

            const sector = clienteFind.sector;

            let nuevoReporte = {};
            
            nuevoReporte.remision = noNota;
            nuevoReporte.concepto = productoFind.nombre;
            nuevoReporte.cliente = cliente;
            nuevoReporte.sector = sector;
            nuevoReporte.divisa = divisa;
            nuevoReporte.fechaPago = Date.now();
            nuevoReporte.estatus = estatus;
            nuevoReporte.formaPago = formaPago;
            nuevoReporte.cliente = cliente;
            nuevoReporte.producto = producto._id;
            nuevoReporte.categoria = producto.nombreCategoria;
            nuevoReporte.vendedor = vendedor;
            nuevoReporte.venta = venta;
            nuevoReporte.precio = total;
            nuevoReporte.descuento = producto.descuento;
            nuevoReporte.cantidad = producto.cantidadVenta;
        
            const reporte = new Reportes(nuevoReporte);

            reporte.save();

        })
    )

}