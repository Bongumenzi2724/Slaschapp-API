const otpGenerator=require('otp-generator');
const User=require('../models/UserRegistrationSchema')

const nodemailer=require('nodemailer');
const { StatusCodes } = require('http-status-codes');

const send_otp=async(req,res)=>{
	//find the user with email
	const user=await User.findOne({email:req.body.email});
	if(!user){
		return res.status(404).json({message:"User Does Not Exist"});
	}
	//generate the otp code
	const otpCode=otpGenerator.generate(4, { upperCaseAlphabets: false,digits:true,specialChars: false,lowerCaseAlphabets:false });
	console.log(otpCode);
	//set the otp code in the user schema
	user.opt=otpCode;
	user.save();
	//send the otp
	const transporter=nodemailer.createTransport({
		service:'gmail',
		port:587,
		secure:false,
		auth:{
			user:'nuenginnovations@gmail.com',
			pass:'uoby xoot pebo fwrx'
		}
	});
	const mailOptions={
		from:'nuenginnovations@gmail.com',
		to:user.email,
		subject:'Verify Email',
		text:`Your OTP code is:${otpCode}`
	};
	transporter.sendMail(mailOptions,(error,info)=>{
		if(error){
			console.log(error);
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:'Error Sending Email'})
		}
		else{
			//console.log(info.response);
			return res.status(StatusCodes.OK).json({message:"OTP Sent Successfully"});
		}
	})
}

const verify_otp=async(req,res)=>{
	const user=User.findOne({email:req.body.email});
	if(!user){
		return res.status(StatusCodes.NOT_FOUND).json({message:"User Not Found"});
	}
	else{
		const otpCode=req.body.otp;
		if(otpCode===user.otp){
			user.verified=true;
			user.save();
			return res.status(StatusCodes.OK).json({message:"Email Successfully Verified"})
		}
		else{
			return res.status(401).json({message:"Invalid OTP"});
		}
	}
}

module.exports={send_otp,verify_otp}