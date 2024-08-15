const User=require('../models/UserRegistrationSchema')
const generateOTP = require('../utils/generateOtp');
const sendEmail=require('../utils/sendEmail');

//Forgot Password Functionality
const user_forgot_password=async(req,res)=>{

    try {
        const {email}=req.body;
         //Generate Token
         //Call the function to generate the otp
         resetToken=generateOTP();
         resetTokenExpiration=Date.now()+3600000;
         //Send the reset token to user via email
        await sendEmail(email,resetToken);
        console.log(resetToken);
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

        

        await User.findOneAndUpdate(query,update,options);
        await user.save(); 
        return res.status(201).json({message:"Password Reset Successfully"});
    } catch (error) {
        res.status(500).json({error:"An error occurred while resetting the password"});
    }
}

module.exports={user_forgot_password,user_password_reset}