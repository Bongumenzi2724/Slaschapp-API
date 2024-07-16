const User=require('../models/UserRegistrationSchema')
const crypto=require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer=require('nodemailer');
const OTP = require('../models/OTPSchema');
const otpGenerator=require('otp-generator');
//mail options

//Forgot Password Functionality
const user_forgot_password=async(req,res)=>{
    try {
        const {email}=req.body;
         //Generate Token

         resetToken=otpGenerator.generate(6, { upperCaseAlphabets: false,digits:true,specialChars: false,lowerCaseAlphabets:false });;

         resetTokenExpiration=Date.now()+3600000;

         //Send the reset token to user via email

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
            else{
                console.log("OTP Sent Successfully");
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
        
        res.status(200).json({message:`Password token ${resetToken} to ${email}`});

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

//generate the otp and save it on the database
const generateOtp = async () => {
    const otp = Math.floor(100000 + Math.random() * 900000); // generate 6 digit OTP
    const expires = new Date(Date.now() + 300000); // expires in 5 minutes
    const newOtp = new OTP({otp:otp, expires:expires });
    await newOtp.save();
    return otp;
  };


//send the otp, otp is important for registration
const user_send_otp=async(req,res,next)=>{
    try {
        const user=await User.findOne({email:req.body.email})
        if(!user){
            return res.status(404).json({message:"User does not exist please check your email or register"})
        }

        const transporter=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'bongumenzinzama@gmail.com',
                pass:"bongumenzi#27#"
                }
        })
        const otp=await generateOtp();
        const mailOptions={
            from:'bongumenzinzama@gmail.com',
            to:user.email,
            subject:"Password Reset OTP",
            text:`Your OTP is ${otp}`
        };
        transporter.sendMail(mailOptions,(err,info)=>{
            if(err){
                console.log(err);
                return res.status(500).json({message:"An error occured while sending mail"})
            }
            else{
                console.log("OTP sent successfully");
                console.log(info)
                res.status(200).json({message:"OTP sent successfully"});
                //next();
            }
        })
    } catch (error) {
      return res.status(500).json({message:error.message});  
    }
}

//verify otp, otp is important for registration
const user_verify_Otp = async (req,res,next) => {
    //find the user using the email and modify the status of the user or  owner
    try {
      const otp=req.body.otp;
      const email=req.body.email;

      const user_otp = await OTP.findOne({ otp:otp });
      if (!user_otp) {
        return res.status(404).json({message:"Invalid OTP"});
      }
      const now = new Date();
      if (now > user_otp.expires) {
        return res.status(404).json({message:"OTP Has Expired"});
      }
      //find the user using the email and update the status of the user

      res.json(200).json({message:"OTP Verified"});
      next();
    } catch (error) {
      return res.status(500).json({message:error.message});
    }
  };

//verify token, token is important for password reset
const user_verify_token=async(req,res)=>{
    try {
        const user=await User.findOne({resetToken:req.body.resetToken});
        if(!user){
            return res.status(404).json({message:"User not found,Invalid reset token"});
        }
        res.json({message:"Reset Token is Valid"});
        next();
    } catch (error) {
        return res.status(500).json({message:error.message}); 
    }
}
module.exports={user_forgot_password,user_password_reset,user_send_otp,user_verify_Otp}