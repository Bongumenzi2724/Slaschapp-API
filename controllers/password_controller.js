const User=require('../models/UserRegistrationSchema')
const crypto=require('crypto');
const bcrypt = require('bcryptjs')

//Forgot Password Functionality
const forgotPassword=async(req,res)=>{
    try {
        const {email}=req.body;
         //Generate Token
         resetToken=crypto.randomBytes(20).toString('hex');
         resetTokenExpiration=Date.now()+3600000;
        const user=await User.findOneAndUpdate({email:email},{resetToken:resetToken,resetTokenExpiration:resetTokenExpiration},{new:true,runValidators:true});
        const user1=await User.findOne({email});
        console.log(user);
        if(!user){
            return res.status(400).json({error:"User not found"});
        }
        await user.save();
        res.status(200).json({message:"Password reset token sent",token:user1.resetToken});

    } catch (error) {
        console.error('Error Generating Token',error);
        res.status(500).json({error:"An error occurred while generating a reset token"});
    }
}
//Reset Password Functionality
const passwordReset=async(req,res)=>{
    try {
        const {newPassword,email}=req.body;
        const {resetToken}=req.params;
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(newPassword,salt);
        //find the user with the matching reset token
        const user=await User.findOneAndUpdate({email,resetToken},{password:hashedPassword,resetToken:'',resetTokenExpiration:''},{new:true,runValidators:true});
        const user1=await User.findOne({email});
        if(!user){
            return res.status(401).json({error:"Invalid or expired reset token"});
        }
        return res.status(200).json({message:"Password Reset Successfully"});
    } catch (error) {
        console.error('Error Generating Token',error);
        res.status(500).json({error:"An error occurred while resetting the password"});
    }
}
module.exports={forgotPassword,passwordReset}