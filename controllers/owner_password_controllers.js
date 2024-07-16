const BusinessOwnerRegistration = require('../models/BusinessOwnerRegistration');
const crypto=require('crypto');
const bcrypt = require('bcryptjs');
const otpGenerator=require('otp-generator');
const nodemailer=require('nodemailer');

//Forgot Password Functionality

const owner_forgot_password=async(req,res)=>{
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
        })

        const update={$set:{resetToken:resetToken,resetTokenExpiration:resetTokenExpiration}};

        const query={email:email};

        const options={new:true,runValidators:true};

        const owner=await BusinessOwnerRegistration.findOneAndUpdate(query,update,options);

        await owner.save();
        if(!owner){
            return res.status(400).json({error:"User not found"});
        }
        
        res.status(200).json({message:`Password token ${resetToken} to ${email}`,resetToken:resetToken});

    } catch (error) {
        res.status(500).json({error:"An error occurred while generating a reset token"});
    }
}

//Reset Password Functionality
const owner_password_reset=async(req,res)=>{

    try {
        const {password,resetToken}=req.body;
        console.log(password," ",resetToken);
        const owner=await BusinessOwnerRegistration.findOne({resetToken:resetToken});
        console.log(owner);
        if(!owner){
            return res.status(401).json({error:"Invalid or expired reset token"});
        }
        const resetToken2="";

        const resetTokenExpiration="";

        const update={$set:{password:password,resetToken:resetToken2,resetTokenExpiration:resetTokenExpiration}};

        const options={new:true,runValidators:true};

        const query={email:owner.email};
        await BusinessOwnerRegistration.findOneAndUpdate(query,update,options);
        await owner.save(); 
        return res.status(200).json({message:"Password Reset Successfully"});
    } catch (error) {
        res.status(500).json({error:"An error occurred while resetting the password"});
    }
}

//send the otp, otp is important for registration
const owner_send_otp=async(req,res)=>{
    try {
        const owner=await BusinessOwnerRegistration.findOne({email:req.body.email})
        if(!owner){
            return res.status(404).json({message:"User does not exist please check your email or register"})
        }
        const otp=owner.otp;
        const mailOptions={
            from:'"Adlinc OTP:"<bongumenzinzama@gmail.com>',
            to:user.email,
            subject:"Password Reset OTP",
            text:`Your OTP is ${otp}`
        };
        nodemailer.sendMail(mailOptions,(err,info)=>{
            if(err){
                console.log(err);
                return res.status(500).json({message:"An error occured while sending mail"})
            }
            else{
                console.log("OTP sent successfully");
                console.log(info)
                return res.status(200).json({message:"OTP sent successfully"});
            }
        })
    } catch (error) {
      return res.status(500).json({message:error.message});  
    }
}
//verify otp, otp is important for registration
const owner_verify_otp=async(req,res)=>{
    try {
        const owner=await BusinessOwnerRegistration.findOne({otp:req.body.otp});
        if(!owner){
            return res.status(404).json({message:"The specified user does not exist"});
        }
        res.status(200).json({message:"OTP verification is successfully"});
        next();
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}
//verify token, token is important for password reset
const owner_verify_token=async(req,res)=>{
    try {
        const owner=await BusinessOwnerRegistration.findOne({resetToken:req.body.resetToken});
        if(!owner){
            return res.status(404).json({message:"User not found,Invalid reset token"});
        }
        res.json({message:"Reset Token is Valid"});
        next();
    } catch (error) {
        return res.status(500).json({message:error.message}); 
    }
}
module.exports={owner_forgot_password,owner_password_reset,owner_send_otp,owner_verify_otp,owner_verify_token}

