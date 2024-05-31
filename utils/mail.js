const nodemailer=require('nodemailer');
const transporter=nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth:{
        user:"sender gmail account",
        pass:"sender gmail account password"
    }
});

module.exports=transporter


