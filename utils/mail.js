const nodemailer=require('nodemailer');

const transporter=nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth:{
        user:'bongumenzinzama@gmail.com',
        pass:"bongumenzi#27#"
    }
});

module.exports=transporter;

