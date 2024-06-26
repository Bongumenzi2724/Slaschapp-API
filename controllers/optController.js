const otpGenerator=require('otp-generator');
const User=require('../models/UserRegistrationSchema')
const { StatusCodes } = require('http-status-codes');

const verify_otp=async(req,res)=>{
	//create the delay of minutes
	const otp_user=await User.findOne({otp:req.body.otp});
	if(!otp_user){
		return res.status(StatusCodes.NOT_FOUND).json({message:"User Not Found"});
	}
	if(otp_user.otp===null){
		return res.status(StatusCodes.EXPECTATION_FAILED).json({message:"OTP has Expired"})
	}
	else{
		//console.log(req.body);
		const otpCode=req.body.otp;
		//return res.status(200).json({otp:req.body.otp});
		if(otpCode===otp_user.otp){
			otp_user.verified=true;
			otp_user.otp=null;
			otp_user.status="Active";
    		let newUser=otp_user;
    		await User.findOneAndUpdate({email:otp_user.email},{$set:newUser},{new:true});
    		await newUser.save();
			return res.status(StatusCodes.OK).json({message:"Email Successfully Verified"})
		}
		else{
			return res.status(401).json({message:"Invalid OTP"});
		} 
	}
}

module.exports={verify_otp}