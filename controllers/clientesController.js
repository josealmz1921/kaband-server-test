 const { findByIdAndUpdate } = require('../models/Clientes');
const Clientes = require('../models/Clientes');
 
 exports.crearCliente = async (req,res) => {
     try {

        const {email} = req.body;

        const validarEmail = await Clientes.findOne({email});

        if(validarEmail){
            return res.status(400).json({msg:'El correo ingresado ya esta registrado'})
        }

        const nuevoCliente = new Clientes(req.body);
        await nuevoCliente.save();

        return res.json({msg:'Cliente creado correctamente'});

         
     } catch (error) {
         return res.status(400).json({msg:'Ha ocurrido un error al crear el cliente'});
     }
 }

 exports.editarClientes = async (req,res) => {

     try {

        const { 
            contacto,
            telefono,
            celular,
            email,
            sector,
            facturacionStatus,
            razonSocial,
            rfc,
            calle,
            colonia,
            nroInterior,
            nroExterior,
            ciudad,
            estado,
            codigoPostal,
            empresa,
            vendedor,
            _id } = req.body;

            let nuevoCliente = {};

            nuevoCliente.contacto = contacto;
            nuevoCliente.telefono = telefono;
            nuevoCliente.celular = celular;
            nuevoCliente.email = email;
            nuevoCliente.sector = sector;
            nuevoCliente.facturacionStatus = facturacionStatus;
            nuevoCliente.razonSocial = razonSocial;
            nuevoCliente.rfc = rfc;
            nuevoCliente.calle = calle;
            nuevoCliente.colonia = colonia;
            nuevoCliente.nroInterior = nroInterior;
            nuevoCliente.nroExterior = nroExterior;
            nuevoCliente.ciudad = ciudad;
            nuevoCliente.estado = estado;
            nuevoCliente.codigoPostal = codigoPostal;
            nuevoCliente.empresa = empresa;
            nuevoCliente.vendedor = vendedor;

            const cliente = await Clientes.findByIdAndUpdate({_id},nuevoCliente,{new:true});

            return res.json({cliente});
         
     } catch (error) {
         console.log(error);
        return res.status(400).json({msg:'Ha ocurrido un error al editar el cliente'});
     }
 }

 exports.eliminarCliente = async (req, res) => {
     try {

        const {_id} = req.params;
        await Clientes.findByIdAndDelete({_id});

        res.json({msg:'Cliente eliminado correctamente'});
         
     } catch (error) {
        return res.status(400).json({msg:'Ha ocurrido un error al eliminar el cliente'});
     }
 }

 exports.obtenerCliente = async (req,res) => {
     try {

        const {_id} = req.params;
        const cliente = await Clientes.findById({_id});
        if(!cliente){
            return res.status(400).json({mag:'No se ha encontrado al usuario solicitado'})
        }
        return res.json({cliente});
         
     } catch (error) {
         
     }
 }

 exports.obtenerClientes = async (req,res) => {
     try {

        const { page,name } = req.params;

        const options = JSON.parse(name);

        let query = {}

        if(options.busqueda !== null){
            query = {
                "$or":[
                    {'empresa':{ $regex: options.busqueda, $options:'i' }},
                    {'contacto':{ $regex: options.busqueda, $options:'i' }},
                    {'email':{ $regex: options.busqueda, $options:'i' }}
                ]
            }
        }

        const skip = (page - 1) * 25;
        const clientes = await Clientes.find(query).limit(25).skip(skip);
        const total = await Clientes.find(query).count();

        return res.json({clientes,total});
         
     } catch (error) {
         return res.status(400).json({msg:'Ha ocurrido un error al otener a los usuarios'})
     }
 }

 exports.obtenerAllClientes = async (req,res) => {
     try {

        const clientes = await Clientes.find();
        return res.json({clientes});
         
     } catch (error) {
         return res.status(400).json({msg:'Error al obtener los clientes'})
     }
 }