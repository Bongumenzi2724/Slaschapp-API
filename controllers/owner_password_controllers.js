const BusinessOwnerRegistration = require('../models/BusinessOwnerRegistration');
const crypto=require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer=require('nodemailer');

//Forgot Password Functionality
const owner_forgot_password=async(req,res)=>{
    try {
        const {email}=req.body;
         //Generate Token
         resetToken=crypto.randomBytes(20).toString('hex');
         resetTokenExpiration=Date.now()+3600000;
        const owner=await BusinessOwnerRegistration.findOneAndUpdate({email:email},{resetToken:resetToken,resetTokenExpiration:resetTokenExpiration},{new:true,runValidators:true});
        const owner1=await BusinessOwnerRegistration.findOne({email});
        console.log(owner);
        if(!user){
            return res.status(400).json({error:"User not found"});
        }
        await user.save();
        res.status(200).json({message:"Password reset token sent",token:owner1.resetToken});

    } catch (error) {
        console.error('Error Generating Token',error);
        res.status(500).json({error:"An error occurred while generating a reset token"});
    }
}

//Reset Password Functionality
const owner_password_reset=async(req,res)=>{
    try {
        const {newPassword,email,resetToken}=req.body;
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(newPassword,salt);
        //find the user with the matching reset token
        const owner=await BusinessOwnerRegistration.findOneAndUpdate({email,resetToken},{password:hashedPassword,resetToken:'',resetTokenExpiration:''},{new:true,runValidators:true});
        const owner1=await BusinessOwnerRegistration.findOne({email});
        if(!owner){
            return res.status(401).json({error:"Invalid or expired reset token"});
        }
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

