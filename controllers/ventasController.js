const Ventas = require('../models/Ventas');
const Usuarios = require('../models/Usuarios');
const Clientes = require('../models/Clientes');
const Reportes = require('../models/Reportes');
const { descontarStock,devolverStock,guardarDatosReporte,validarStock } = require('../functions/modificarStock');

exports.crearVenta = async (req,res) => {
    try {

        const {cliente,formaPago,divisa,estatus,descuento,vendedor,data} = req.body;

        const subtotal = data.reduce((acc,item) => (item.precioVenta * item.cantidadVenta) + acc , 0);
        const descuentoTotal = data.reduce((acc,item) => (((item.precioVenta * item.cantidadVenta) * item.descuento) / 100) + acc , 0);
        const total = subtotal - descuentoTotal;

        const ultimo = await Ventas.find().sort({$natural:-1}).limit(1);

        const noNota = ultimo.length === 0 ? 1 : (ultimo[0].nota + 1);

        const values = await validarStock(data);

        const validacion = values.filter(item => item < 0);

        if(validacion.length > 0){
            return res.status(400).json({msg:'No se pudo realizar la venta ya que hay productos que superan el stock actual. \n Le recomendamos realizar la venta manualmente'})
        }

        let nuevaVenta = {};
        nuevaVenta.cliente = cliente;
        nuevaVenta.nota = noNota;
        nuevaVenta.total = total;
        nuevaVenta.informacion = data;
        nuevaVenta.status = estatus;
        nuevaVenta.formaPago = formaPago;
        nuevaVenta.divisa = divisa;
        nuevaVenta.descuento = descuento;
        nuevaVenta.vendedor = vendedor;

        const venta = new Ventas(nuevaVenta);
        await venta.save();

        await descontarStock(data,vendedor);
        
        await guardarDatosReporte(data,vendedor,cliente,total,formaPago,divisa,estatus,noNota,venta._id);
        
        return res.json({msg:'Venta guardada correctamente'});

    } catch (error) {
        
        console.log(error);
        return res.status(400).json({msg:'Ha ocurrido un error al crear el producto'});

    }
} 

exports.pagarVenta = async (req,res) => {
    try {

        const { _id,formaPago } = req.params;


        const venta = await Ventas.findByIdAndUpdate({_id},{
            $set:{
                status:'Pagada',
                formaPago:formaPago
            }
        },{new:true});

        await Reportes.updateMany({venta:_id},{
            $set:{
                estatus:'Pagada',
                formaPago:formaPago
            }
        })

        return res.json({venta});

    } catch (error) {
        
        return res.status(400).json({msg:'Ha ocurrido un error al editar el producto'});

    }
}

exports.cancelarVenta = async (req,res) => {
    try {

        const { _id,usuario } = req.params;


        const venta = await Ventas.findByIdAndUpdate({_id},{
            $set:{
                status:'Cancelada'
            }
        },{new:true});

        await Reportes.deleteMany({venta:_id});

        await devolverStock(venta.informacion,usuario);

        return res.json({msg:'Venta cancelada correctamente'});

    } catch (error) {
        
        return res.status(400).json({msg:'Ha ocurrido un error al cancelar el producto'});

    }
}

exports.obtenerVentas = async (req,res) => {
    try {
        
        const { page,name } = req.params;

        const options = JSON.parse(name);

        let query = {}

        if(options.cliente || options.folio || options.vendedor || options.estatus){

            query = {"$and":[]}

            if(options.estatus){
                query['$and'].push({'status':options.estatus});
            }

            if(options.cliente){
                query['$and'].push({'cliente':options.cliente});
            }
    
            if(options.folio ){
                query['$and'].push({'nota': Number(options.folio) });
            }
    
            if(options.vendedor ){
                query['$and'].push({'vendedor': options.vendedor });
            }
        }  
                
        const skip = (page - 1) * 25;
        const resultados = await Ventas.find(query).limit(25).skip(skip).sort({nota:-1});
        const total = await Ventas.find(query).count();

        const venta = await Promise.all(
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

        return res.json({venta,total});

    } catch (error) {
        return res.status(400).json({msg:'Error al obtener los almacenes'});
    }
}

exports.obtenerVenta = async (req,res) => {
    try {
        
        const venta = await Ventas.findById({_id: req.params._id});
        return res.json({venta});

    } catch (error) {
        return res.status(400).json({msg:'Error al obtener los almacenes'});
    }
}