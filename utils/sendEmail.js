const nodemailer=require('nodemailer');

const sendEmail=async(email,resetToken)=>{
    //call the generate otp method
    let userEmail='';
    try {
        const transporter=nodemailer.createTransport({
        service:'gmail',
        port:587,
        secure:false,
        auth:{
            user:'nuenginnovations@gmail.com',
            pass:'uoby xoot pebo fwrx'
        }
        });
        const mailOptions={
        from:'nuenginnovations@gmail.com',
        to:email,
        subject:'Verify Email',
        text:`Your OTP code is:${resetToken}`
        };

        transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            //console.log(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:'Error Sending Email'})
        }
        else{
            //console.log("OTP Sent Successfully");
            userEmail=info.accepted[0]

            console.log(userEmail);
        }
        })


    } catch (error) {
        console.error(error);
        return res.status(500).json({message:error.message});
    }
}

module.exports=sendEmail;
