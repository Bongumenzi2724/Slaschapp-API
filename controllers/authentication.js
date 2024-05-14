const {BadRequestError,UnauthenticatedError} = require('../errors')
const User=require('../models/UserRegistrationSchema')
const {StatusCodes}=require('http-status-codes')
const BusinessOwner=require('../models/BusinessOwnerRegistration')
const nodemailer=require('nodemailer');
const OTP=require('../models/userOTPVerification')
//Nodemailer Stuff
let transporter=nodemailer.createTransport({
    //host:"smtp-email.gmail.com",
    service:'Gmail',
    auth:{
        user:process.env.SMTP_MAIL,
        pass:process.env.SMTP_APP_PASS,
    },
});
//register app user
const registerUser= async(req,res)=>{
    //sendOTP to the email provided
     // Find the most recent OTP for the email
		/* const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
		console.log(response);
		if (response.length === 0) {
			// OTP not found for the email
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		} else if (otp !== response[0].otp) {
			// Invalid OTP
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		} */
    //Verify OTP,than move on and create your user
    try{ 
        //const result=await cloudinary.uploader.upload(req.file.path);
        //console.log(result);
        //req.body.profilePicture=result.secure_url;
        //req.body.cloudinary_id=result.public_id; 
        
        const user=await User.create({...req.body})
        const token=user.createJWT()
        return res.status(200).json({user:user,token:token});

    }catch(error){
        console.log(req.body)
        return res.status(500).status({status:false,message:error.message})
    }
}
//user verification controller
const userVerification=async({email},res)=>{
    try {
        const otp=`${Math.floor(1000+Math.random()*9000)}`;

        const mailOptions={
            from:process.env.SMTP_MAIL,
            to:email,
            subject:'Verify Your Email'
        }

    } catch (error) {
        
    }
}
//login app user
const loginUser=async(req,res)=>{
    const {email,password}=req.body

    if(!email||!password){
        throw new BadRequestError("Please provide email and password")
    }
    const user= await User.findOne({email})
    if(!user){
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const isPasswordCorrect= await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user:{id:user._id,name:user.firstname,surname:user.surname,email:user.email},token})
}
//logout the user
//deregister the user
//login business owner


const loginBusinessOwner=async(req,res)=>{
    const {email,password}=req.body
    if(!email||!password){
        throw new BadRequestError("Please provide email and password")
    }
    const owner= await BusinessOwner.findOne({email})
    if(!owner){
        throw new UnauthenticatedError('Invalid Credentials')
    }
   
    const isPasswordCorrect= await owner.comparePassword(password)

    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const token = owner.createJWT()
    res.status(StatusCodes.OK).json({owner:{id:owner._id,name:owner.firstname,surname:owner.surname,email:owner.email},token:{token}})
}

//register business owner
const registerBusinessOwner=async(req,res)=>{
    try{ 
        const BusinessOwner = await BusinessOwnerRegistration.create({...req.body})
        const token=owner.createJWT()
        return res.status(StatusCodes.CREATED).json({BusinessOwner:BusinessOwner,token:token});
    }catch(error){
        return res.status(500).status({status:false,message:error.message})
    }
}

module.exports={registerUser,loginUser,loginBusinessOwner,registerBusinessOwner,userVerification}