const User=require('../models/UserRegistrationSchema')
const crypto=require('crypto');
const bcrypt = require('bcryptjs')

//Forgot Password Functionality
const forgotPassword=async(req,res)=>{
    try {
        console.log("=====================================");
        const {email}=req.body;
        const user=await User.findOne({email});
        //console.log(user);
        //console.log("Original Password");
        console.log(user.firstname);
        console.log(user.password);
        if(!user){
            return res.status(400).json({error:"User not found"});
        }
        //Generate Token
        const resetToken=crypto.randomBytes(20).toString('hex');
        user.resetToken=resetToken;
        user.resetTokenExpiration=Date.now()+3600000;
        console.log(user.resetToken);
        console.log(user.resetTokenExpiration);
        await user.save();
        console.log(user);
        res.status(200).json({message:"Password reset token sent",resetToken:resetToken});

    } catch (error) {
        console.error('Error Generating Token',error);
        res.status(500).json({error:"An error occurred while generating a reset token"});
    }
}
//Reset Password Functionality
const passwordReset=async(req,res)=>{
    try {
        //console.log(req.body);
        const {resetToken,newPassword,email}=req.body;
        //find the user with the matching reset token
        const user=await User.findOne({resetToken,
        resetTokenExpiration:{$gt:Date.now()},email});
        console.log("Original Password");
        console.log(user.password);
        console.log("=====================================");
        if(!user){
            return res.status(401).json({error:"Invalid or expired reset token"});
        }
        const newUser=await user.ForgotPassword(newPassword);
        console.log("New Password")
        console.log(newUser);
        return res.status(200).json({message:"Password Reset Successfully",password:newPassword});
    } catch (error) {
        console.error('Error Generating Token',error);
        res.status(500).json({error:"An error occurred while resetting the password"});
    }
}
module.exports={forgotPassword,passwordReset}