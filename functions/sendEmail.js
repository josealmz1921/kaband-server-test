const nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');


exports.sendMailSell = async () => {
    
    const transporter = await nodemailer.createTransport({
        pool: true,
        host:'smtp-relay.gmail.com',
        post:587,
        secure:false,
        auth:{
            user:"joseharry1921@gmail.com",
            pass:"ywjtbwqeikmligbl"
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


    const mailOptions = {
        from:"joseharry1921@gmail.com",
        to:'josepalmz19@gmail.com',
        subject:"Informacion de compra",
        template:'index',
        context:{
            idVenta:'dkfdknfdknfkd545sd',        
            envio:(380).toLocaleString('es-MX', {maximumFractionDigits: 2,minimumFractionDigits: 2}),
            total:(450).toLocaleString('es-MX', {maximumFractionDigits: 2,minimumFractionDigits: 2}),
            productos: [
                {
                    
                    nombre: 'Producto 1',
                    cantidad: 5,
                    precio: (150).toLocaleString('es-MX', {maximumFractionDigits: 2,minimumFractionDigits: 2})
                },
                {
                    nombre: 'Producto 2',
                    cantidad: 5,
                    precio: (150).toLocaleString('es-MX', {maximumFractionDigits: 2,minimumFractionDigits: 2})
                }
            ]
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