const nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');


exports.sendMailSell = async (productos,id,envio,total,correo) => {
    
    const transporter = await nodemailer.createTransport({
        pool: true,
        host:'mail.kabandnet.com',
        port:587,
        secure:false,
        service: 'gmail',
        auth:{
            user:'contacto@kabandnet.com',
            pass:'romeli200!!'
        },
        tls:{
            secure: false,
            ignoreTLS: true,
            rejectUnauthorized: false
        }
    })

    transporter.use('compile', hbs({
        viewEngine:'express-handlebars',
        viewPath:'./views/'
    }));

    const productosVentas = productos.map(item => {

        let data = {};
        data.cantidad = item.cantidad;
        data.precio = (item.cantidad * item.precioVenta).toLocaleString('es-MX', {maximumFractionDigits: 2,minimumFractionDigits: 2})
        data.nombre = item.nombre;

        return data;

    })

    const mailOptions = {
        from:"contacto@grupokaband.com",
        to:correo,
        subject:"Informacion de compra",
        template:'index',
        context:{
            idVenta:id,        
            envio:(envio).toLocaleString('es-MX', {maximumFractionDigits: 2,minimumFractionDigits: 2}),
            total:(total/100).toLocaleString('es-MX', {maximumFractionDigits: 2,minimumFractionDigits: 2}),
            productos:productosVentas
        }
    }

    await transporter.sendMail(mailOptions, (error,info) =>{
        if(error){
            console.log(error);
        }else{
            console.log(info);
            transporter.close();
        }
    })

}

exports.sendMailContacto = async (datos) => {
    
    const transporter = await nodemailer.createTransport({
        pool: true,
        host:'mail.kabandnet.com',
        port:587,
        secure:false,
        service: 'gmail',
        auth:{
            user:'contacto@kabandnet.com',
            pass:'romeli200!!'
        },
        tls:{
            secure: false,
            ignoreTLS: true,
            rejectUnauthorized: false
        }
    })

    const mailOptions = {
        from:"contacto@grupokaband.com",
        to:"contacto@grupokaband.com",
        subject:"Informacion de contacto",
        html: `
            <p>Nombre: ${datos.nombre}</p> </br>
            <p>Email: ${datos.email}</p> </br>
            <p>Teléfono: ${datos.telefono}</p> </br>
            <p>Asunto: ${datos.asunto}</p></br>
            <p>Mensaje: ${datos.mensaje}</p> </br>
        `,
    }

    await transporter.sendMail(mailOptions, (error,info) =>{
        if(error){
            console.log(error);
        }else{
            console.log(info);
            transporter.close();
        }
    })

}
