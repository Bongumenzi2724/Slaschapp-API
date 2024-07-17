const User=require('../models/UserRegistrationSchema')
const nodemailer=require('nodemailer');
const otpGenerator=require('otp-generator');

//Forgot Password Functionality
const user_forgot_password=async(req,res)=>{
    try {
        const {email}=req.body;
         //Generate Token
         //Call the function to generate the otp
         resetToken=otpGenerator.generate(6, { upperCaseAlphabets: false,digits:true,specialChars: false,lowerCaseAlphabets:false });;

         resetTokenExpiration=Date.now()+3600000;

         //Send the reset token to user via email
         //call the function to send the email
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
            to:req.body.email,
            subject:'Verify Email',
            text:`Your reset token code is:${resetToken}`
        };

        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                //console.log(error);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:'Error Sending Email'})
            }
        })

        const update={$set:{resetToken:resetToken,resetTokenExpiration:resetTokenExpiration}};

        const query={email:email};

        const options={new:true,runValidators:true};

        const user=await User.findOneAndUpdate(query,update,options);

        await user.save();

        if(!user){
            return res.status(400).json({error:"User not found"});
        }
        
        res.status(200).json({message:`Password token ${resetToken} sent to ${email}`,resetToken:resetToken});

    } catch (error) {
        res.status(500).json({error:"An error occurred while generating a reset token"});
    }
}

//Reset Password Functionality
const user_password_reset=async(req,res)=>{

    try {
        const {password,resetToken}=req.body;
        const user=await User.findOne({resetToken:resetToken});
        if(!user){
            return res.status(401).json({error:"Invalid or expired reset token"});
        }
        const resetToken2="";

        const resetTokenExpiration="";

        const update={$set:{password:password,resetToken:resetToken2,resetTokenExpiration:resetTokenExpiration}};

        const options={new:true,runValidators:true};

        const query={email:user.email};

        console.log(query.email);

        await User.findOneAndUpdate(query,update,options);
        await user.save(); 
        return res.status(200).json({message:"Password Reset Successfully"});
    } catch (error) {
        res.status(500).json({error:"An error occurred while resetting the password"});
    }
}


module.exports={user_forgot_password,user_password_reset}