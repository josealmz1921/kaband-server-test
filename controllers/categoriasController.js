const Categorias = require('../models/Categorias');
const Productos = require('../models/Productos');
const {subirImagen} = require('../functions/subirImagen');
const {eliminarImagen} = require('../functions/eliminarImagen');

exports.crearCategoria = async (req,res) => {

    try {
        
        const categoria = new Categorias(req.body);
        
        await categoria.save();
        return res.json({msg:'Categoria creada correctamete !!!'});

    } catch (error) {
        console.log(error);
        res.status(400).json({msg:'Ha ocurrido un error al crear la categoria'})
    }
    
}

exports.editarCategoria = async (req,res) => {
    try {

        const { padre,nombre,_id } = req.body;

        let nuevaCategoria = {};

        nuevaCategoria.padre = padre;
        nuevaCategoria.nombre = nombre;

        const categoria = await Categorias.findByIdAndUpdate({_id},nuevaCategoria,{new:true});
        res.json({categoria});
        
    } catch (error) {
        res.status(400).json({msg:'Ha ocurrido un error al editar la categoria'})
    }
}

exports.imagenesCategoria = async (req,res) => {
    try {

        const categoria = await Categorias.findById({_id:req.body._id});

        let nuevaCategoria = {};

        if(req.files['imagenMenu']){
            let imagenNueva = await subirImagen(req.files['imagenMenu'][0]);
            if(imagenNueva){
                nuevaCategoria.imagenMenu = imagenNueva;
                categoria.imagenMenu ? eliminarImagen(categoria.imagenMenu) : null;
            }
        }

        if(req.files['imagenCategoria']){
            let imagenNueva = await subirImagen(req.files['imagenCategoria'][0]);
            if(imagenNueva){
                nuevaCategoria.imagen = imagenNueva;
                categoria.imagen ? eliminarImagen(categoria.imagen) : null;
            }
        }

        await Categorias.findByIdAndUpdate({_id:req.body._id},nuevaCategoria,{new:true});

        res.json({msg:'ok'});

        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Ha ocurrido un error al subir las imagenes'})
    }
}

exports.eliminarCategoria = async (req,res) => {
    try {

        const { _id } = req.params;

        const categoria = await Categorias.findOne({padre:_id});
        const productos = await Productos.findOne({categoria:_id});

        if(categoria){
            return res.status(400).json({msg:'No se puede eliminar una categoria que tiene categorias vinculadas'})
        }

        if(productos){
            return res.status(400).json({msg:'No se puede eliminar una categoria que tiene productos vinculados'})
        }

        await Categorias.findByIdAndDelete({_id});
        
        res.json({msg:'Categoria eliminada correctamente !!!'});

    } catch (error) {
        res.status(400).json({msg:'Ha ocurrido un error al eliminar la categoria'})
    }
}

exports.obtenerCategorias = async (req,res) => {
    try {

        const { page,name } = req.params;

        const options = JSON.parse(name);

        let query = {}

        if(options.busqueda !== null){
            query = {
                'nombre':{ $regex: options.busqueda, $options:'i' }
            }
        }

        const skip = (page - 1) * 25;
        const cats = await Categorias.find(query).limit(25).skip(skip);
        const total = await Categorias.find(query).count();

        const categorias = await Promise.all(
            cats.map(async cat => {

                const categori = JSON.parse(JSON.stringify(cat));

                if(categori.padre !== null){

                    const catPadre = await Categorias.findById({_id:cat.padre});
                    
                    if(catPadre){
                        categori.nombrePadre = catPadre.nombre;
                    }else{
                        categori.nombrePadre = 'Undefined';
                    }

                    
                }else{
                    categori.nombrePadre = '[NINGUNA]';
                }

                return categori;

            })
        )

        return res.json({categorias,total});
        
    } catch (error) {
        console.log(error);
        res.status(400).json({msg:'Ha ocurrido un error al obtener las categoria'})
    }
}

exports.obtenerCategoriasAll = async (req,res) => {
    try {

        const categorias = await Categorias.find();
        return res.json({categorias});
        
    } catch (error) {
        console.log(error);
        res.status(400).json({msg:'Ha ocurrido un error al obtener las categoria'})
    }
}

exports.obtenerCategoriasPagina = async (req,res) => {
    try {
        
        const resultado = await Categorias.find();

        const categoriasTotal = await Promise.all(
            resultado.map( async item => {

                let cantidad = 0;
                const set = JSON.parse(JSON.stringify(item));
                const cats = resultado.filter( cat => cat.padre == set._id );        
                await Promise.all(
                    cats.map( async cat => {
                        const cant = await Productos.find({categoria:cat._id}).count();
                        cantidad = cant + cantidad;
                    })
                );

                set.cantidad = cantidad;

                if(set.padre !== null) return null;

                return set;

            })
        )


        const categorias = categoriasTotal.filter( item => item !== null );

        return res.json({categorias});
        
    } catch (error) {
        console.log(error);
        res.status(400).json({msg:'Ha ocurrido un error al obtener las categoria'})
    }
}

exports.obtenerCategoriasPaginaHijos = async (req,res) => {
    try {
        
        const resultado = await Categorias.find({padre:req.params.id});

        const categoriasTotal = await Promise.all(
            resultado.map( async item => {

                let cantidad = 0;
                const set = JSON.parse(JSON.stringify(item));
                set.cantidad = await Productos.find({categoria:item._id}).count();
                if(set.padre === null) return null;
                return set;

            })
        )

        const categorias = categoriasTotal.filter( item => item !== null );
        return res.json({categorias});
        
    } catch (error) {
        console.log(error);
        res.status(400).json({msg:'Ha ocurrido un error al obtener las categoria hijos'})
    }
}

exports.obtenerCategoria = async (req,res) => {
    try {

        const categoria = await Categorias.findById({_id:req.params._id});
        return res.json({categoria});
        
    } catch (error) {
        console.log(error);
        res.status(400).json({msg:'Ha ocurrido un error al obtener las categoria'})
    }
}