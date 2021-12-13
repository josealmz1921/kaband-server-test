const Reportes = require('../models/Reportes');
const Usuarios = require('../models/Usuarios');
const groupBy = require('lodash/groupBy');
const Clientes = require('../models/Clientes');
const Productos = require('../models/Productos');
const Ventas = require('../models/Ventas');
const Categorias = require('../models/Categorias');
const xl = require('excel4node');
const Cotizaciones = require('../models/Cotizaciones');

exports.reporteInicio = async (req,res) => {
    try {

        const { rol,_id } = req.params;

        let fecha = new Date(Date.now());
        let fechaInicio = new Date(`${fecha.getUTCFullYear()}/${fecha.getMonth()+1}/01`);
        let fechaFin = new Date (fecha.getFullYear(),fecha.getMonth()+1, 0);

        let query = { "$and": [{fecha: { $gte: fechaInicio }}, {fecha:{ $lte: fechaFin }}]};
        let query1 = { "$and": [{ status : 'Pagada'}]};
        let query2 = { "$and": [{ status : 'Cancelada'}]};
        let query3 = { "$and": [{ status : 'Pendiente'}]};
        let query4 = { };

        if(rol !== 'Administrador' && rol !== 'Gerente'){
            query["$and"].push({vendedor:_id});
            query1["$and"].push({vendedor:_id});
            query2["$and"].push({vendedor:_id});
            query3["$and"].push({vendedor:_id});
            query4 = {"$and": [{vendedor:_id}]};
        }
        

        const resultados = await Cotizaciones.find(query4).limit(10).sort({fecha: -1});

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

        const total = await Ventas.aggregate([
            {$match: query},
            {$group:{
                _id : '',
                total:{ $sum: "$total" }
            }}
        ])

        const totalPagado = await Ventas.aggregate([
            {$match: query1},
            {$group:{
                _id : '',
                total:{ $sum: "$total" }
            }}
        ])

        const totalCancelado = await Ventas.aggregate([
            {$match: query2},
            {$group:{
                _id : '',
                total:{ $sum: "$total" }
            }}
        ])

        const totalPendiente = await Ventas.aggregate([
            {$match: query3},
            {$group:{
                _id : '',
                total:{ $sum: "$total" }
            }}
        ])

        let totales = {};

        totales.cancelado = totalCancelado.length > 0 ? totalCancelado[0].total : 0;
        totales.pagado = totalPagado.length > 0 ? totalPagado[0].total : 0;
        totales.pendiente = totalPendiente.length > 0 ? totalPendiente[0].total : 0;
        totales.total = total.length > 0 ? total[0].total : 0;

        return res.json({cotizaciones,totales});
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({msg:'Ha ocurrido un error al obtener la información'});
    }
}

exports.reporteProductos = async (req,res) => {
    try {

        const { date } = req.params;

        const options = JSON.parse(date);

        let fecha = new Date(Date.now());
        let fechaInicio = new Date(`${fecha.getUTCFullYear()}/${fecha.getMonth()+1}/01`);
        let fechaFin = new Date (fecha.getFullYear(),fecha.getMonth()+1, 0);

        if(options.inicio && options.fin){
            fechaInicio = new Date(options.inicio);
            fechaFin = new Date (options.fin);
        }

        let query = { "$and": [{fechaPago: { $gte: fechaInicio }}, {fechaPago:{ $lte: fechaFin }}]}

        const productos = await Reportes.find(query);
        const reportesProductosAgrupodos = groupBy(productos,'producto');

        const reporte = Object.values(reportesProductosAgrupodos).map(report => {

            let data = {
                ventas: 0,
                ganancias: 0,
                producto:''
            };

            report.map(value => {

                data.ventas = value.cantidad + data.ventas; 
                data.ganancias = (value.precio * value.cantidad) + data.ganancias; 
                data.producto = value.concepto; 
                
            })

            return data;

        })


        res.json({reporte});

        
    } catch (error) {
        console.log(error);
        return res.status(400).json({msg:'Ha ocurrido un error al obtener el reporte de los clientes'});
    }
}

exports.exportarProdutos = async (req,res) => {
    try {

        let titulos = [
            'Nombre',
            'Sku',
            'Precio Compra',
            'Precio Venta',
            'Categoria',
        ];

        const productos = await Productos.find();

        await productos[0].almacenes.map(almacen => {
            titulos.push(almacen.nombre);
        })
        

        const wb = new xl.Workbook();
        var ws = wb.addWorksheet('Data productos');

        var style = wb.createStyle({
            font: {
                color: '#FFFFFF',
                size: 12,
            },
            fill: {
                type: 'pattern',
                patternType: 'solid',
                bgColor: '#000000',
                fgColor: '#203764',
            },
        });

        var styleCell = wb.createStyle({
            font: {
                color: '#000000',
                size: 12,
            },
            fill: {
                type: 'pattern',
                patternType: 'solid',
                bgColor: '#000000',
                fgColor: '#ffff00',
            },
            border: {
                left: {
                    style: 'thin',
                    color: 'black',
                },
                right: {
                    style: 'thin',
                    color: 'black',
                },
                top: {
                    style: 'thin',
                    color: 'black',
                },
                bottom: {
                    style: 'thin',
                    color: 'black',
                },
            },
        });

        // Colocando cabeceras
        titulos.map((head,index) => {
            ws.cell(1,index+1)
            .string(head)
            .style(style);
        })

        await Promise.all(
            productos.map(async(vals,i) => {
            
            const cat = await Categorias.findById({_id:vals.categoria})

            ws.cell(i+2,1)
            .string(vals.nombre)
            .style(styleCell);
            ws.cell(i+2,2)
            .string(vals.sku)
            .style(styleCell);
            ws.cell(i+2,3)
            .string(vals.precio.toString())
            .style(styleCell);
            ws.cell(i+2,4)
            .string(vals.precioVenta.toString())
            .style(styleCell);
            ws.cell(i+2,5)
            .string(cat.nombre)
            .style(styleCell);
            vals.almacenes.map((almacen,index) => {
                ws.cell(i+2,6+index)
                .string(almacen.cantidad.toString())
                .style(styleCell);
            })
            
        }))

        ws.column(1).setWidth(40);
        ws.column(2).setWidth(30);
        ws.column(3).setWidth(30);
        ws.column(4).setWidth(30);
        ws.column(5).setWidth(30);
        ws.column(6).setWidth(15);
        ws.column(7).setWidth(15);
        ws.column(8).setWidth(15);
        ws.column(9).setWidth(15);
        ws.column(10).setWidth(15);
        ws.column(11).setWidth(15);
        
        wb.write(`Excel-${Date.now()}.xlsx`, res);
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({msg:'Ha ocurrido un error al generar el archivo'})
    }
}

exports.reporteExcelVendedores = async (req,res) => {

    const titulos = [
        'Factura',
        '# Remision',
        'Fecha factura',
        'Concepto',
        'Cliente',
        'Sector',
        'Monto USD',
        'Monto MXN',
        'Fecha Pago',
        'Estatus',
        'Producto',
        'Categoria',
        'Vendedor',
        'Forma de pago',
        'Cuenta',
        'Observaciones'
    ];

    try {

        const wb = new xl.Workbook();
        var ws = wb.addWorksheet('Reporte vendedores');

        const productos = await Reportes.find();

        // Create a reusable style
        var style = wb.createStyle({
            font: {
                color: '#FFFFFF',
                size: 12,
            },
            fill: {
                type: 'pattern',
                patternType: 'solid',
                bgColor: '#000000',
                fgColor: '#203764',
            },
        });

        var styleCell = wb.createStyle({
            font: {
                color: '#000000',
                size: 12,
            },
            fill: {
                type: 'pattern',
                patternType: 'solid',
                bgColor: '#000000',
                fgColor: '#ffff00',
            },
            border: {
                left: {
                    style: 'thin',
                    color: 'black',
                },
                right: {
                    style: 'thin',
                    color: 'black',
                },
                top: {
                    style: 'thin',
                    color: 'black',
                },
                bottom: {
                    style: 'thin',
                    color: 'black',
                },
            },
        });


        // Colocando cabeceras
        titulos.map((head,index) => {

            ws.cell(1,index+1)
            .string(head)
            .style(style);

        })

        let data = [];

        const agrupodos = groupBy(productos,'vendedor');

        await Promise.all( Object.values(agrupodos).map( async (value) => {

                const usuario = await Usuarios.findById({_id:value[0].vendedor});
                const cliente = await Clientes.findById({_id:value[0].cliente});

                if(!cliente || !usuario) return null

                const agrupadosVentas = groupBy(value,'venta');
                let tempData = [];

                await Promise.all( Object.values(agrupadosVentas).map(async (val) => {

                        Object.values(val).map((item,index) => {

                            let valores = {};
                            
                            valores.factura = ''; 
                            valores.remision = index === 0 ? item.remision : '';
                            valores.fechaFactura = '';
                            valores.concepto = item.concepto;
                            valores.cliente = index === 0 ? cliente.empresa  : '';
                            valores.sector = index === 0 ? item.sector : '';
                            valores.montoUSD = index === 0 ? (item.divisa !== 'PESOS MXN' ? item.precio : '') : '';
                            valores.montoMXN = index === 0 ? (item.divisa === 'PESOS MXN' ? item.precio : '') : '' ;
                            valores.fechaPago = index === 0 ? `${new Date(item.fechaPago).toLocaleDateString('es-mx', {year: 'numeric', month: '2-digit', day: '2-digit'})} ${new Date(item.fechaPago).toLocaleTimeString('es-mx', {hour:'2-digit', minute:'2-digit', hour12: true})}` : '';
                            valores.estatus = index === 0 ? item.estatus : '' ;
                            valores.producto = index === 0 ? item.concepto : '' ;
                            valores.categoria = item.categoria;
                            valores.vendedor = usuario.nombre;
                            valores.formaPago = index === 0 ? item.formaPago : '';
                            valores.cuenta = '';
                            valores.observaciones = '';

                            tempData.push(valores);
                        })

                }))
                

                data.push(tempData);
                
            })
        )

        data.map((vals) => {

            vals.map((valores,index) =>{
                Object.values(valores).map( async (val,i) => {
                    
                    ws.cell(index+2,i+1)
                    .string(val.toString())
                    .style(styleCell);
                })
            })
        })

        ws.column(1).setWidth(15);
        ws.column(2).setWidth(15);
        ws.column(3).setWidth(20);
        ws.column(4).setWidth(15);
        ws.column(5).setWidth(15);
        ws.column(6).setWidth(15);
        ws.column(7).setWidth(15);
        ws.column(8).setWidth(30);
        ws.column(9).setWidth(20);
        ws.column(10).setWidth(15);
        ws.column(11).setWidth(25);
        ws.column(12).setWidth(30);
        ws.column(13).setWidth(30);
        ws.column(14).setWidth(20);
        ws.column(15).setWidth(15);
        ws.column(16).setWidth(30);
        
        wb.write(`Excel-${Date.now()}.xlsx`, res);

    } catch (error) {
        console.log(error);
        return res.status(400).json({msg:'Ha ocurrido un error al generar el archivo'})
    }
}

exports.reporteVentas = async (req,res) => {
    try {
        
        const { page,name } = req.params;

        const options = JSON.parse(name);

        let query = {}

        if(options.inicio !== null || options.fin !== null || options.vendedor !== null){

            query = {"$and":[]}

            if(options.inicio !== null){
                query['$and'].push({$gte: new Date(options.inicio)});
            }

            if(options.fin !== null){
                query['$and'].push({$lte: new Date(options.fin)});
            }
    
            if(options.vendedor !== null ){
                query['$and'].push({'vendedor': options.vendedor });
            }
        }   
        
        const skip = (page - 1) * 25;
        const resultados = await Ventas.find(query).limit(25).skip(skip);
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
                }else{
                    venta.nombreVendedor = 'Undefined';
                }

                return venta

            })
        )

        const totalPagado = await Ventas.aggregate([
            {$match: { status : 'Pagada', }},
            {$group:{
                _id : '',
                total:{ $sum: "$total" }
            }}
        ])

        const totalCancelado = await Ventas.aggregate([
            {$match: { status : 'Cancelada', }},
            {$group:{
                _id : '',
                total:{ $sum: "$total" }
            }}
        ])

        const totalPendiente = await Ventas.aggregate([
            {$match: { status : 'Pendiente', }},
            {$group:{
                _id : '',
                total:{ $sum: "$total" }
            }}
        ])

        let totales = {};

        totales.cancelado = totalCancelado.length > 0 ? totalCancelado[0].total : 0;
        totales.pagado = totalPagado.length > 0 ? totalPagado[0].total : 0;
        totales.pendiente = totalPendiente.length > 0 ? totalPendiente[0].total : 0; 

        return res.json({venta,total,totales});

    } catch (error) {
        console.log(error);
        return res.status(400).json({msg:'Ha ocurrido un error al obtener el reporte de la venta'})
    }
}