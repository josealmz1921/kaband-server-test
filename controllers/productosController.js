const Productos = require('../models/Productos');
const Almacenes = require('../models/Almacenes');
const Categorias = require('../models/Categorias');
const Movimientos = require('../models/Movimientos');
const Usuarios = require('../models/Usuarios');
const {subirImagen} = require('../functions/subirImagen');
const {eliminarImagen} = require('../functions/eliminarImagen');

exports.crearProducto = async (req,res) => {
    try {

        const { nombre,sku,precio,precioVenta,descripcionProducto,categoria,peso,specs,largo,ancho,alto,colores,accesorios,descripcionCorta } = req.body;
        let nuevoProducto = {};
        const almacenes = await Almacenes.find();
        const listadoAlamacenes = almacenes.map(almacen => {
            let nuevoAlmacen = {};
            nuevoAlmacen.id = almacen._id;
            nuevoAlmacen.cantidad = 0;
            nuevoAlmacen.nombre = almacen.nombre;
            return nuevoAlmacen
        })
        
        listadoAlamacenes.push({
            id:0,
            cantidad:0,
            nombre:'Bodega'
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
        nuevoProducto.specs = specs;
        nuevoProducto.accesorios = accesorios;
        nuevoProducto.descripcionCorta = descripcionCorta;

        const producto = new Productos (nuevoProducto);
        producto.save();
        return res.json({msg:'Producto creado correctamente'});

    } catch (error) {
        
        return res.status(400).json({msg:'Ha ocurrido un error al crear el producto'});

    }
}

exports.editarProducto = async (req,res) => {
    try {
        const { nombre,sku,precio,precioVenta,descripcionProducto,categoria,peso,specs,largo,ancho,alto,colores,_id,accesorios,descripcionCorta } = req.body;

        const productoActual = await Productos.findById({_id}); 

        let vinculados = productoActual.vinculados;
        let coloresImagenes = productoActual.imagenesColores;

        let coloresImagenesNuevo = [];
        let coloresVinculados = [];

        colores.forEach(value => {
            const color = value.toString();
           
            const buscarColorVinculado = vinculados.find(value => value.color.toString() === color);
            if(buscarColorVinculado) coloresVinculados = [...coloresVinculados,buscarColorVinculado];

            const buscarColoresImagenes = coloresImagenes.find(value => value.color === color);
            if(buscarColoresImagenes) coloresImagenesNuevo = [...coloresImagenesNuevo,buscarColoresImagenes];

        });

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
        nuevoProducto.specs = specs;    
        nuevoProducto.accesorios = accesorios;
        nuevoProducto.descripcionCorta = descripcionCorta;
        nuevoProducto.vinculados = coloresVinculados;
        nuevoProducto.imagenesColores = coloresImagenesNuevo;

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

        let cantidad = 25;

        if(options.cantidad){
            cantidad = options.cantidad
        }

        if(!options.busqueda && options.categoria){
            query = {
                "$and":[
                    {'categoria':options.categoria}
                ]
            }
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
            query = {
                "$and":[
                    {'nombre':{ $regex: options.busqueda, $options:'i' }}
                ]
            }
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
                        "$or":cats,
                    }
                }
            }
        }

        if(options.alto && options.ancho && options.longitud){

            if(query["$and"]){
                const altoMax = {'alto':{ $lte:options.alto}};
                const altoMin = {'alto':{$gte:options.alto}};
                const anchoMax = {'ancho':{$lte:options.ancho}};
                const anchoMin = {'ancho':{$gte:options.ancho}};
                const longitudMax = {'longitud':{$lte:options.longitud}};
                const longitudMin = {'longitud':{$gte:options.longitud}};
                query["$and"].push(altoMax);
                query["$and"].push(altoMin);
                query["$and"].push(anchoMax);
                query["$and"].push(anchoMin);
                query["$and"].push(longitudMax);
                query["$and"].push(longitudMin);
            }else{
                query = {
                    "$and":[]
                }
                const altoMax = {'alto':{ $lte:options.alto}};
                const altoMin = {'alto':{$gte:options.alto}};
                const anchoMax = {'ancho':{$lte:options.ancho}};
                const anchoMin = {'ancho':{$gte:options.ancho}};
                const longitudMax = {'longitud':{$lte:options.longitud}};
                const longitudMin = {'longitud':{$gte:options.longitud}};
                query["$and"].push(altoMax);
                query["$and"].push(altoMin);
                query["$and"].push(anchoMax);
                query["$and"].push(anchoMin);
                query["$and"].push(longitudMax);
                query["$and"].push(longitudMin);
            }
        }

        if(options.principal){
            if(query["$and"]){
                query["$and"].push({
                    principal:options.principal
                });
            }else{
                query = {
                    "$and":[]
                }
                query["$and"].push({
                    principal:options.principal
                });
            }
        }
        
        const skip = (page - 1) * cantidad;
        const resultados = await Productos.find(query).limit(cantidad).skip(skip);
        const total = await Productos.find(query).count();

        resultados.sort((a, b) => {            
            if (a.nombre.toLowerCase() < b.nombre.toLowerCase()) return -1;
            if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) return 1;
            return 0;
        })

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

exports.obtenerProductosBuscador = async (req,res) => {
    try {
        
        const { name } = req.params;

        const options = JSON.parse(name);

        let query = {}

        if(options.busqueda){
            query = {
                "$and":[
                    {'nombre':{ $regex: options.busqueda, $options:'i' }},
                    {principal:options.principal}
                ]
            }
        }
        
        console.log(query);

        const productos = await Productos.find(query);

        return res.json({productos});

    } catch (error) {
        console.log(error);
        return res.status(400).json({msg:'Error al obtener los productos'});
    }
}

exports.obtenerProducto = async (req,res) => {
    try {
        
        const producto = await Productos.findById({_id: req.params._id});
        const categoria = await Categorias.findById({_id:producto.categoria});

        const accesorios = await Promise.all(
            producto.accesorios.map( async item => {
                let data = {};
                const prod = await Productos.findById({_id:item._id});
                return prod;
            })
        )

        producto.accesorios = accesorios;
        
        const stock = await Promise.all(
            producto.vinculados.map( async item => {
                let data = {};
                const prod = await Productos.findById({_id:item.id});
                data.almacenes = prod.almacenes;
                data.color = item.color;
                return data;
            })
        )

        return res.json({producto,categoria,stock});

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
        const resultados = await Movimientos.find(query).limit(25).skip(skip).sort({fecha:-1});
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
        let pdf = busqueda.pdf;
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

            if(req.files['pdf']){
                const imagenNueva = await subirImagen(req.files['pdf'][0]);
                if(imagenNueva){
                    nuevoProducto.pdf = imagenNueva;
                    if(pdf) eliminarImagen(pdf);
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

        const producto = await Productos.findById({_id:req.body._id});
        const nuevosColoresVinculados = producto.imagenesColores.filter(img => img.imagen !== req.body.imagen);

        let nuevoProducto = {};
        nuevoProducto.imagenes = req.body.listado;
        nuevoProducto.imagenesColores = nuevosColoresVinculados;
        await Productos.findByIdAndUpdate({_id:req.body._id},nuevoProducto,{new:true});
        await eliminarImagen(req.body.imagen);
        res.json({msg:'Imagen eliminada'})

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Error al eliminar la imagen'})
    }
} 

exports.productosSimilares = async (req,res) => {
    try {
        
        const {categoria,id} = req.params;

        const productos = await Productos.find({"$and":[
            {categoria:categoria},
            {_id:{$ne:id}}
        ]}).limit(16);

        res.json({productos});

    } catch (error) {
        console.log(error);
        res.status(400).json({msg:'Ha ocurrido un error al obtener los productos'})
    }
}

exports.imagenColores = async (req,res) => {
    try {

        const { id,imagen } = req.body;
        
        const producto = await Productos.findById({_id:id});

        let imagenesColores = producto.imagenesColores;

        const validacion = imagenesColores.filter(item => item.color === imagen.color);

        const validacionColorImagen = imagenesColores.filter(item => item.imagen === imagen.imagen);

        if(validacionColorImagen.length > 0){
            imagenesColores = imagenesColores.filter(item => item.imagen !== imagen.imagen);
        }

        if(validacion.length > 0){
            return res.status(400).json({msg:'El color seleccionado de la imagen ya esta asignado a otra imagen debes quitarlo para poder cambiarlo'});
        }

        imagenesColores = [...imagenesColores,imagen];

        await Productos.findByIdAndUpdate({_id:id},{
            $set:{
                imagenesColores:imagenesColores
            }
        },{new:true});

        return res.json({msg:'Cambios actualizados correctamente'});

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Ha ocurrido un error al asignar la imagen al color'});
    }
}

exports.eliminarImagenColor = async (req,res) => {
    try {
        
        const { id,color } = req.body;

        const producto = await Productos.findById({_id:id});

        let imagenesColores = producto.imagenesColores;

        imagenesColores = imagenesColores.filter(item => item.color !== color);

        await Productos.findByIdAndUpdate({_id:id},{
            $set:{
                imagenesColores:imagenesColores
            }
        },{new:true});

        return res.json({msg:'El color ha sido quitado correctamente'});


    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Ha ocurrido un error al asignar la imagen al color'});
    }
}

exports.convertirPrincipal = async (req,res) => {
    try {
        
        console.log(req.body);

        const producto = await Productos.findById({_id:req.body.id});

        await Productos.findByIdAndUpdate({_id:req.body.id},{
            $set:{
                principal:!producto.principal
            }
        })

        res.json({msg:'Actualización realizada correctamente'})

    } catch (error) {
        res.status(500).json({msg:'Error al convertir el producto en principal'});
    }
}

exports.vincularProductos = async (req,res) => {
    try {
        
        await Productos.findByIdAndUpdate({_id:req.body.id},{
            $set:{
                vinculados:req.body.vinculados
            }
        })

        res.json({msg:'Vinculación realizada correctamente'});

    } catch (error) {
        res.status(500).json({msg:'Error al convertir el producto en principal'});
    }
}