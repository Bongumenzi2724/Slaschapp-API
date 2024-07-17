const otpGenerator=require('otp-generator');
const User=require('../models/UserRegistrationSchema')
const { StatusCodes } = require('http-status-codes');
const BusinessOwner=require('../models/BusinessOwnerRegistration')
const verify_user_otp=async(req,res)=>{
	//create the delay of minutes
	const otp_user=await User.findOne({otp:req.body.otp});

	console.log(otp_user);
	
	if(!otp_user){
		return res.status(StatusCodes.NOT_FOUND).json({message:"User Not Found"});
	}
	if(otp_user.otp===null){
		return res.status(StatusCodes.EXPECTATION_FAILED).json({message:"OTP has Expired"})
	}
	else{
		const otpCode=req.body.otp;
		if(otpCode===otp_user.otp){
			otp_user.verified=true;
			otp_user.otp=null;
			otp_user.status="Active";
    		let newUser=otp_user;
    		await User.findByIdAndUpdate({_id:otp_user._id},{$set:newUser},{new:true});
    		await newUser.save();
			return res.status(StatusCodes.OK).json({message:"Email Successfully Verified"})
		}
		else{
			return res.status(401).json({message:"Invalid OTP"});
		} 
	}
}

const verify_owner_otp=async(req,res)=>{
	//create the delay of minutes
	const otp_owner=await BusinessOwner.findOne({otp:req.body.otp});

	
	if(!otp_owner){
		return res.status(StatusCodes.NOT_FOUND).json({message:"User Not Found"});
	}
	if(otp_owner.otp===null){
		return res.status(StatusCodes.EXPECTATION_FAILED).json({message:"OTP has Expired"})
	}
	else{
		const otpCode=req.body.otp;
		if(otpCode===otp_user.otp){
			otp_owner.verified=true;
			otp_owner.otp=null;
			otp_owner.status="Active";
    		let newOwner=otp_owner;
    		await User.findByIdAndUpdate({_id:otp_user._id},{$set:newOwner},{new:true});

    		await newOwner.save();
			
			return res.status(StatusCodes.OK).json({message:"Email Successfully Verified"})
		}
		else{
			return res.status(401).json({message:"Invalid OTP"});
		} 
	}
}
module.exports={verify_user_otp,verify_owner_otp}