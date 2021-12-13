const Cotizaciones = require('../models/Cotizaciones');
const Ventas = require('../models/Ventas');
const Clientes = require('../models/Clientes');
const Usuarios = require('../models/Usuarios');
const { descontarStock,guardarDatosReporte,validarStock } = require('../functions/modificarStock');

exports.remision = async (req,res) => {
    try {

        const {_id} = req.params;
        await Cotizaciones.findByIdAndDelete({_id});
        return res.json({msg:'Remision realizada correctamente'})

    } catch (error) {
        console.log(error);
        return res.status(400).json({msg:'Error al realizar la remición'});
    }
}

exports.crearCotizacion = async (req,res) => {
    try {

        const {cliente,divisa,descuento,data,comentarios,vendedor} = req.body;

        const subtotal = data.reduce((acc,item) => (item.precioVenta * item.cantidadVenta) + acc , 0);
        const descuentoTotal = data.reduce((acc,item) => (((item.precioVenta * item.cantidadVenta) * item.descuento) / 100) + acc , 0);
        const total = subtotal - descuentoTotal;

        const ultimo = await Cotizaciones.find().sort({$natural:-1}).limit(1);

        let nuevaCotizacion = {};
        nuevaCotizacion.cliente = cliente;
        nuevaCotizacion.nota = ultimo.length === 0 ? 1 : (Number(ultimo[0].nota) + 1);
        nuevaCotizacion.total = total;
        nuevaCotizacion.informacion = data;
        nuevaCotizacion.divisa = divisa;
        nuevaCotizacion.descuento = descuento;
        nuevaCotizacion.comentarios = comentarios;
        nuevaCotizacion.vendedor = vendedor;

        const cotizacion = new Cotizaciones(nuevaCotizacion);
        await cotizacion.save();
        
        return res.json({msg:'Cotizacion guardada correctamente'});

    } catch (error) {
        
        console.log(error);
        return res.status(400).json({msg:'Ha ocurrido un error al crear el producto'});

    }
}

exports.editarCotizacion = async (req,res) => {
    try {

        const {cliente,divisa,descuento,data,comentarios,_id} = req.body;

        const subtotal = data.reduce((acc,item) => (item.precioVenta * item.cantidadVenta) + acc , 0);
        const descuentoTotal = data.reduce((acc,item) => (((item.precioVenta * item.cantidadVenta) * item.descuento) / 100) + acc , 0);
        const total = subtotal - descuentoTotal;

        let nuevaCotizacion = {};
        nuevaCotizacion.cliente = cliente;
        nuevaCotizacion.total = total;
        nuevaCotizacion.informacion = data;
        nuevaCotizacion.divisa = divisa;
        nuevaCotizacion.descuento = descuento;
        nuevaCotizacion.comentarios = comentarios;

        const cotizacion = await Cotizaciones.findByIdAndUpdate({_id},nuevaCotizacion,{new:true});

        return res.json({cotizacion});

    } catch (error) {
        console.log(error);
        return res.status(400).json({msg:'Ha ocurrido un error al editar la cotización'});

    }
}

exports.cancelarCotizacion = async (req,res) => {
    try {

        const { _id } = req.params;


        await Cotizaciones.findByIdAndDelete({_id});

        return res.json({msg:'Eliminado correctamete'});

    } catch (error) {
        
        return res.status(400).json({msg:'Ha ocurrido un error al editar el producto'});

    }
}

exports.obtenerCotizaciones = async (req,res) => {
    try {
        
        const { page,name } = req.params;

        const options = JSON.parse(name);

        let query = {}

        if(options.cliente !== null){
            query = {
                'cliente': options.cliente
            }
        }

        const skip = (page - 1) * 25;
        const resultados = await Cotizaciones.find(query).limit(25).skip(skip);
        const total = await Cotizaciones.find(query).count();

        const cotizaciones = await Promise.all(
            resultados.map(async result => {

                const venta = JSON.parse(JSON.stringify(result));

                const cliente = await Clientes.findById({_id:venta.cliente});
                const vendedor = venta.vendedor ? await Usuarios.findById({_id:venta.vendedor}) : null;

                if(cliente){
                    venta.nombreCliente = cliente.empresa;
                }else{
                    venta.nombreCliente = 'Undefined';
                }

                if(vendedor){
                    venta.nombreVendedor = vendedor.nombre;
                    venta.email = vendedor.email;
                    venta.telefono = vendedor.telefono;

                }else{
                    venta.nombreVendedor = 'Undefined';
                    venta.email = 'Undefined';
                    venta.telefono = 'Undefined';
                }

                return venta

            })
        )

        return res.json({cotizaciones,total});

    } catch (error) {
        console.log(error);
        return res.status(400).json({msg:'Error al obtener los almacenes'});
    }
}

exports.obtenerCotizacion = async (req,res) => {
    try {
        
        const venta = await Ventas.findById({_id: req.params._id});
        return res.json({venta});

    } catch (error) {
        return res.status(400).json({msg:'Error al obtener los almacenes'});
    }
}