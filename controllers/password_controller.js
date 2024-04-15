const User=require('../models/UserRegistrationSchema')
const crypto=require('crypto');
const bcrypt = require('bcryptjs')

const forgotPassword=async(req,res)=>{
    try {
        console.log(req.body);
        const {email}=req.body;
        const user=await User.findOne({email});
        console.log("Forgot Password Functionality");
        console.log(user);
        if(!user){
            return res.status(400).json({error:"User not found"});
        }
        //Generate Token
        const resetToken=crypto.randomBytes(20).toString('hex');
        user.resetToken=resetToken;
        user.resetTokenExpiration=Date.now()+3600000;
        await user.save();
        console.log(user);
        res.status(200).json({message:"Password reset token sent",resetToken:resetToken});

    } catch (error) {
        console.error('Error Generating Token',error);
        res.status(500).json({error:"An error occurred while generating a reset token"});
    }
}

const passwordReset=async(req,res)=>{
    try {
        console.log(req.body);
        const {resetToken,newPassword,email}=req.body;
        //find the user with the matching reset token
        const user=await User.findOne({resetToken,
        resetTokenExpiration:{$gt:Date.now()},email});
        console.log(user);
        if(!user){
            return res.status(401).json({error:"Invalid or expired reset token"});
        }

        //Encypt and hash the new password

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(newPassword,salt);

        //update the new user password, reset token fields and save
        user.password=hashedPassword;
        user.resetToken=undefined;
        user.resetTokenExpiration=undefined;
        await user.save();
        return res.status(200).json({message:"Password Reset Successfully",password:newPassword});
    } catch (error) {
        console.error('Error Generating Token',error);
        res.status(500).json({error:"An error occurred while resetting the password"});
    }
}
module.exports={forgotPassword,passwordReset}