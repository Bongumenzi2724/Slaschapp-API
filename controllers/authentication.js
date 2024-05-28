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
        console.log("User Registration")
        const user=await User.create({...req.body})
        //console.log(user)
        const token=user.createJWT()
        return res.status(201).json({User:user,token:token}); 

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

const UserRegistration=async(req,res)=>{
    console.log("Business Owner ");
    const user=await User.create({...req.body})
    const token=user.createJWT()
    return res.status(201).json({User:user,token:token,message:"Business Owner Registration"});
}

const registerBusinessOwner=async(req,res)=>{

    try{ 
        const newOwner=new BusinessOwner({
            firstname:req.body.firstname,
            secondname:req.body.secondname,
            surname:req.body.surname,
            profilePicture:req.body.profilePicture,
            phoneNumber:req.body.phoneNumber,
            email:req.body.email,
            password:req.body.password,
            AcceptTermsAndConditions:req.body.AcceptTermsAndConditions,
            locationOrAddress:req.body.locationOrAddress,
            birthday:req.body.birthday,
            IdNumber:req.body.IdNumber,
            IdDocumentLink:req.body.IdDocumentLink,
            gender:req.body.gender,
            resetToken:req.body.resetToken,
            resetTokenExpiration:req.body.resetTokenExpiration,
            status:req.body.status
        });
        newOwner.save();
        //const owner=await BusinessOwner.create({...req.body});
        const token=newOwner.createJWT();
        console.log(token);
        return res.status(201).json({BusinessOwner:newOwner,token:token});
    }catch(error){
        return res.status(500).status({status:false,message:error.message})
    }
}

module.exports={registerUser,loginUser,UserRegistration,loginBusinessOwner,registerBusinessOwner,userVerification}