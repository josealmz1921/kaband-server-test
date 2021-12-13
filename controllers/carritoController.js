const Productos = require('../models/Productos');
const VentasOnline = require('../models/VentasOnline');
const { descontarStockOnline } = require('../functions/modificarStock');
const Stripe = require('stripe');
const stripe = new Stripe('sk_test_8o8PKNnNIbEFLSFhSfS2pcpu00FtSiKiLu');

exports.obtenerProductos = async (req,res) => {

    try {

        let array = [];
        req.body.map( item => {
            const data = {_id : item.id};
            array.push(data);
        })
        const query = { "$or":array };
        const data = await Productos.find(query);
        res.json(data);
        
    } catch (error) {
        res.status(400).json({msg:'Ha ocurrido un error'});
    }

}

exports.pagarProductos = async (req,res) => {
    try {

        const {detalles,productos,id,totalCotizacion} = req.body;

        const { 
            nombre,
            apellidos,
            empresa,
            pais,
            localidad,
            region,
            calle1,
            calle2,
            postal_code,
            notas,
            correo,
            telefono,
        } = detalles;

        let nuevaVenta = {};
        nuevaVenta.nombre = nombre;
        nuevaVenta.apellidos = apellidos;
        nuevaVenta.empresa = empresa;
        nuevaVenta.pais = pais;
        nuevaVenta.localidad = localidad;
        nuevaVenta.provincia = region;
        nuevaVenta.calle1 = calle1;
        nuevaVenta.calle2 = calle2;
        nuevaVenta.postal_code = postal_code;
        nuevaVenta.notas = notas;
        nuevaVenta.correo = correo;
        nuevaVenta.telefono = telefono;
        nuevaVenta.productos = productos;

        const total = productos.reduce((acc,item) => acc + (item.precioVenta * item.cantidad) ,0)

        const amount = (total + totalCotizacion) * 100;

        const payment = await stripe.paymentIntents.create({
            amount,
            currency: "mxn",
            description: "Pago de venta de productos kaband poductos",
            payment_method: id,
        })

        const paymentIntent = await stripe.paymentIntents.confirm(
            payment.id,
        );
        
        let pago = {};

        pago.card = paymentIntent.charges.data[0].payment_method_details.card.brand;
        pago.tipecard = paymentIntent.charges.data[0].payment_method_details.card.funding;
        pago.monto = amount;

        nuevaVenta.id = paymentIntent.id;
        nuevaVenta.pago = pago;
        nuevaVenta.envio = totalCotizacion;

        await descontarStockOnline(productos);

        const ventaOnline = new VentasOnline(nuevaVenta);

        await ventaOnline.save();

        res.json({msg:'Se ha realizado tu compra correctamente. \n Te enviamos un correo con la informacion de tu compra'});

    } catch (err) {
        switch (err.type) {
            case 'StripeCardError':
              // A declined card error
              res.status(500).send(err.message);
              break;
            case 'StripeRateLimitError':
              // Too many requests made to the API too quickly
              res.status(500).send(err.message);
              break;
            case 'StripeInvalidRequestError':
              // Invalid parameters were supplied to Stripe's API
              res.status(500).send(err.message);
              break;
            case 'StripeAPIError':
              // An error occurred internally with Stripe's API
              res.status(500).send(err.message);
              break;
            case 'StripeConnectionError':
              // Some kind of error occurred during the HTTPS communication
              res.status(500).send(err.message);
              break;
            case 'StripeAuthenticationError':
              // You probably used an incorrect API key
              res.status(500).send(err.message);
              break;
            default:
              // Handle any other types of unexpected errors
              res.status(500).send('Ha ocurrido un error no se pudo realizar el pago');
              break;
        }
    }
}

exports.obtenerVentas = async (req,res) => {
  try {

    const { page } = req.params;

        const skip = (page - 1) * 25;
        const resultados = await VentasOnline.find().limit(25).skip(skip).sort({fecha:-1});
        const total = await VentasOnline.find().count();

        res.json({resultados,total})
    
  } catch (error) {
    console.log(error); 
    res.status(500).json({msg:'Ha ocurrido un error al obtener el contenido'})
  }
}

exports.cambiarStatus = async (req,res) => {
  try {

    await VentasOnline.findByIdAndUpdate({_id:req.body.id},{$set:{
      status:req.body.status
    }},{new:true})

    res.json({msg:'Status cambiado correctamente'})
    
  } catch (error) {
    console.log(error);
    res.status(500).json({msg:'Ha ocurrido un error al cambiar el status'})
  }
}