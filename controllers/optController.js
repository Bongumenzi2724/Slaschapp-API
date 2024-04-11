const opts=require('../models/optModel');
const randomString=require('randomstring');

const sendEmail=require('../utils/sendEmails');

//Generate OTP

function generateOTP(){
    return randomString.generate({
        length:5,
        charset:'numeric'
    });
}
//Send OTP to the provided email
exports.sendOTP= async (req,res,next)=>{
    try{
        const {email}=req.body;

        const otp=generateOTP();//Generate a 5-figure OTP
        
        const newOTP=new otp({email,otp});
        await newOTP.save();
        // Send OTP Via Email
        await sendEmail({
            to:email,
            subject:'Your OTP',
            message:`<p>Your OTP is:<strong>${otp}</strong></p>`
        });
        res.status(200).json({success:true,message:"OTP sent succcessfully"});
        next();
    }
    catch(error){
        console.error('Error sending OTP',error);
        res.status(500).json({success:false,error:'Internal Server Error'})
    }
}

//verify OTP provided by the user
exports.verifyOTP=async(req,res,next)=>{
    try {
        
        const {email,otp}=req.query;

        const existingOTP=await opts.findOneAndDelete({email,otp});

        if(existingOTP){
            //OTP is Valid
            res.status(200).json({success:true,message:"OTP Verification"});
            next();
        }
        else{
            //OTP is invalid
            res.status(400).json({success:false,error:"Invalid OTP"});
        }

    } catch (error) {
       console.error('Error verifying',error);
       res.status(500).json({success:false,error:"Internal Server Error"})
    }
}