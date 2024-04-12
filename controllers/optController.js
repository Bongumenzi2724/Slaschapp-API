const Opts=require('../models/optModel.js');
const randomString=require('randomstring');
const sendEmail=require('../utils/sendEmails.js');
//Function to Generate OTP
function generateOTP(){
    return randomString.generate({
        length:5,
        charset:'numeric',
    });
}
//Sending OTP to the provided email
exports.sendOTP= async(req,res,next)=>{
    try {
        console.log(req.query);
        console.log(req.body);
        const {email}=req.body;
        console.log(email);
        const otp=generateOTP();
        const newOTP=new Opts({email,otp});
        await newOTP.save();
        //Send OTP via Email
        await sendEmail({
            to:email,
            subject:'Your OTP',
            message:`<p>Your OTP is:<strong>${otp}<strong></p>`
        });
        next();
    } catch (error) {
        console.error('Error Sending OTP:',error);
        res.status(500).json({success:false,message:'Internal Server Error'});
    }
}

exports.verify=async(req,res,next)=>{
    try{
    const {email,otp}=req.query;
    const existingOTP=await Opts.findOneAndDelete({email,otp});
    if(existingOTP){
        //OTP is valid
        res.status(200).json({success:true,message:'OTP verification Successfully'});
        next();
        return;
    }
    else{
        //OTP is invalid
        res.status(400).json({success:false,message:'Invalid OTP'});
    }
    }
    catch(error){
        console.error('Error Verifying OTP:',error);
        res.status(500).json({success:false,message:'Internal Server Erro'});
    }
}