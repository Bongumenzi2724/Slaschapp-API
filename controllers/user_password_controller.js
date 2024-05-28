const User=require('../models/UserRegistrationSchema')
const crypto=require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer=require('nodemailer');
const mail=require('../utils/mail');
const OTP = require('../models/OTPSchema');

//Forgot Password Functionality
const user_forgot_password=async(req,res)=>{
    try {
        const {email}=req.body;
         //Generate Token
         resetToken=crypto.randomBytes(20).toString('hex');
         resetTokenExpiration=Date.now()+3600000;
        const user=await User.findOneAndUpdate({email:email},{resetToken:resetToken,resetTokenExpiration:resetTokenExpiration},{new:true,runValidators:true});
        const user1=await User.findOne({email});
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
const user_password_reset=async(req,res)=>{
    try {
        const {newPassword,email,resetToken}=req.body;
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
            host:'smtp.gmail.com',
            port:587,
            secure:false,
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