const Productos = require('../models/Productos');
const Almacenes = require('../models/Almacenes');
const Categorias = require('../models/Categorias');
const Movimientos = require('../models/Movimientos');
const Usuarios = require('../models/Usuarios');
const {subirImagen} = require('../functions/subirImagen');
const {eliminarImagen} = require('../functions/eliminarImagen');

exports.crearProducto = async (req,res) => {
    try {

        const { nombre,sku,precio,precioVenta,descripcionProducto,categoria,peso,largo,ancho,alto,colores } = req.body;
        let nuevoProducto = {};
        const almacenes = await Almacenes.find();
        const listadoAlamacenes = almacenes.map(almacen => {
            let nuevoAlmacen = {};
            nuevoAlmacen.id = almacen._id;
            nuevoAlmacen.cantidad = 0;
            return nuevoAlmacen
        })
        
        listadoAlamacenes.push({
            id:0,
            cantidad:0
        })

        nuevoProducto.nombre = nombre;
        nuevoProducto.sku = sku;
        nuevoProducto.precio = precio;
        nuevoProducto.precioVenta = precioVenta;
        nuevoProducto.descripcionProducto = descripcionProducto;
        nuevoProducto.categoria = categoria;
        nuevoProducto.almacenes = listadoAlamacenes;
        nuevoProducto.peso = peso;
        nuevoProducto.largo = largo;
        nuevoProducto.ancho = ancho;
        nuevoProducto.alto = alto;
        nuevoProducto.colores = colores;
        nuevoProducto.imagenes = [];

        const producto = new Productos (nuevoProducto);
        producto.save();
        return res.json({msg:'Producto creado correctamente'});

    } catch (error) {
        
        return res.status(400).json({msg:'Ha ocurrido un error al crear el producto'});

    }
}

exports.editarProducto = async (req,res) => {
    try {
        const { nombre,sku,precio,precioVenta,descripcionProducto,categoria,peso,largo,ancho,alto,colores,_id } = req.body;

        let nuevoProducto = {};
        nuevoProducto.nombre = nombre;
        nuevoProducto.sku = sku;
        nuevoProducto.precio = precio;
        nuevoProducto.precioVenta = precioVenta;
        nuevoProducto.descripcionProducto = descripcionProducto;
        nuevoProducto.categoria = categoria;
        nuevoProducto.peso = peso;
        nuevoProducto.largo = largo;
        nuevoProducto.ancho = ancho;
        nuevoProducto.alto = alto;
        nuevoProducto.colores = colores;
        nuevoProducto.imagenes = [];        

        const producto = await Productos.findByIdAndUpdate({_id},nuevoProducto,{new:true});

        await Movimientos.findOneAndUpdate({productoId:_id},{
            $set:
                {
                    producto:nombre
                }
        })

        return res.json({producto});

    } catch (error) {

        console.log(error);
        return res.status(400).json({msg:'Ha ocurrido un error al editar el producto'});

    }
}

exports.editarStock = async (req,res) => {
    try {

        const { almacenes,usuario,_id } = req.body;
        const productoFind = await Productos.findById({_id})
        const almacenesProducto = productoFind.almacenes;
        let almacenesList = [];
        let nuevoProducto = {};
        nuevoProducto.almacenes = almacenes;
        const producto = await Productos.findByIdAndUpdate({_id},nuevoProducto,{new:true});
        almacenesList = almacenesProducto.map(almacen => {
            const almaceActual = almacenes.filter(alm => alm.id == almacen.id );
            let datos = {};
            datos.almacen = almacen.id;
            datos.despues = parseInt(almaceActual[0].cantidad);
            datos.antes = parseInt(almacen.cantidad);
            datos.tipo = parseInt(almaceActual[0].cantidad) > parseInt(almacen.cantidad) ? 'agregado' : 'eliminado';
            return datos;
        })

        let nuevoMovimiento = {};
        nuevoMovimiento.almacenes = almacenesList;
        nuevoMovimiento.producto = productoFind.nombre;
        nuevoMovimiento.productoId = _id;
        nuevoMovimiento.usuario = usuario;
        const movimiento = new Movimientos(nuevoMovimiento);
        await movimiento.save();
        return res.json({producto});
    } catch (error) {
        
        console.log(error);

        return res.status(400).json({msg:'Ha ocurrido un error al editar el producto'});

    }
}

exports.eliminarProdcuto = async (req,res) => {
    try {
        const {_id} = req.params;
        await Productos.findByIdAndDelete({_id});
        return res.json({msg:'Producto eliminado correctamente'})
    } catch (error) {
        return res.status(400).json({msg:'Ha ocurrido un error al eliminar el almacen'});
    }
}

exports.obtenerProductos = async (req,res) => {
    try {
        
        const { page,name } = req.params;

        const options = JSON.parse(name);

        let query = {}

        if(!options.busqueda && options.categoria){
            query = {'categoria':options.categoria}
        }

        if(options.busqueda && options.categoria){
            query = {
                "$and":[
                    {'categoria':options.categoria},
                    {'nombre':{ $regex: options.busqueda, $options:'i' }},
                ]
            }
        }

        if(options.busqueda && !options.categoria){
            query = {'nombre':{ $regex: options.busqueda, $options:'i' }}
        }

        if(options.paginas){
            const categoria = await Categorias.findById({_id:options.categoria});
            if(categoria.padre === null ){
                let cats = [];
                const catsChildren = await Categorias.find({padre:options.categoria})
                catsChildren.map( child => {
                    cats.push({'categoria':child._id})
                })
                if(cats.length > 0){
                    query = {
                        "$or":cats
                    }
                }
            }
        }
        
        const skip = (page - 1) * 25;
        const resultados = await Productos.find(query).limit(25).skip(skip);
        const total = await Productos.find(query).count();

        const productos = await Promise.all(
            resultados.map(async result => {

                const producto = JSON.parse(JSON.stringify(result));

                const categorias = await Categorias.findById({_id:result.categoria});

                const almacenes = await Promise.all(
                    producto.almacenes.map(async almacen => {

                        if(almacen.id === 0){
                            almacen.nombre = 'Bodega';
                        }else{
                            const almacenFind = await Almacenes.findById({_id:almacen.id});
                            if(almacenFind){
                                almacen.nombre = almacenFind.nombre;
                            }
                        }

                        return almacen;
                    })
                )

                producto.almacenes = almacenes;

                if(categorias){
                    producto.nombreCategoria = categorias.nombre;
                }else{
                    producto.nombreCategoria = 'Undefined';
                }

                return producto

            })
        )

        return res.json({productos,total});

    } catch (error) {
        console.log(error);
        return res.status(400).json({msg:'Error al obtener los productos'});
    }
}

exports.obtenerProducto = async (req,res) => {
    try {
        
        const producto = await Productos.findById({_id: req.params._id});
        const categoria = await Categorias.findById({_id:producto.categoria});
        
        return res.json({producto,categoria});

    } catch (error) {
        console.log(error);
        return res.status(400).json({msg:'Error al obtener el producto'});
    }
}

exports.obtenerMovimientos = async (req,res) => {
    try{

        const { page,name } = req.params;

        const options = JSON.parse(name);

        let query = {}

        if(options.busqueda || options.fin || options.inicio){

            query = {"$and":[]}

            if(options.busqueda){
                query['$and'].push({'producto':options.busqueda});
            }
    
            if(options.fin ){
                query['$and'].push({'fecha': {$lte: new Date(options.fin)} });
            }
    
            if(options.inicio ){
                query['$and'].push({'fecha': {$gte: new Date(options.inicio)} });
            }
        }    
        
        const skip = (page - 1) * 25;
        const resultados = await Movimientos.find(query).limit(25).skip(skip);
        const total = await Movimientos.find(query).count();
        const almacenes = await Almacenes.find();

        const movimientos = await Promise.all(
            resultados.map(async result => {

                const venta = JSON.parse(JSON.stringify(result));

                const vendedor = venta.usuario ? await Usuarios.findById({_id:venta.usuario}) : null;

                if(vendedor){
                    venta.nombreVendedor = vendedor.nombre;
                }else{
                    venta.nombreVendedor = 'Undefined';
                }

                return venta

            })
        )

        return res.json({movimientos,almacenes,total});


    } catch(error) {
        
        console.log(error);

        return res.status(400).json({msg:'Error al obtener los movimientos'});
    }
}

exports.obtenerAllProductos = async (req,res) => {
    try {
        
        const productos = await Productos.find();
        res.json({productos});

    } catch (error) {
        console.log(error);
        return res.status(400).json({msg:'Error al obtener los productos'});
    }
}

exports.editarImagenes = async (req,res) => {
    try {

        const { _id } = req.body;
        const busqueda = await Productos.findById({_id});
        let imagenes = busqueda.imagenes;
        let imagenPrincipal = busqueda.img;
        let nuevoProducto = {};
        
        if(req.files !== undefined){

            if(req.files['imagenes']){
                await Promise.all(
                    req.files['imagenes'].map( async imagen => {
                        const imagenNueva = await subirImagen(imagen);
                        if(imagenNueva){
                            imagenes.push(imagenNueva);
                        }
                    })
                )
            }

            if(req.files['imagen']){
                const imagenNueva = await subirImagen(req.files['imagen'][0]);
                if(imagenNueva){
                    nuevoProducto.img = imagenNueva;
                    if(imagenPrincipal) eliminarImagen(imagenPrincipal);
                }
            }
        }
        nuevoProducto.imagenes = imagenes;

        await Productos.findByIdAndUpdate({_id},nuevoProducto,{new:true});

        return res.json({imagenes});

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Error al actualizar las imagenes'})
    }
}

exports.eliminarImagenes = async (req,res) => {
    try {

        let nuevoProducto = {};
        nuevoProducto.imagenes = req.body.listado;
        await Productos.findByIdAndUpdate({_id:req.body._id},nuevoProducto,{new:true});
        await eliminarImagen(req.body.imagen);
        res.json({msg:'Imagen eliminada'})

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Error al eliminar la imagen'})
    }
} 
