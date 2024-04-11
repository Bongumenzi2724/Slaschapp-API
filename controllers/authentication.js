const {BadRequestError,UnauthenticatedError} = require('../errors')
const User=require('../models/UserRegistrationSchema')
const {StatusCodes}=require('http-status-codes')
const BusinessOwner=require('../models/BusinessOwnerRegistration')

//register app user
const registerUser= async(req,res)=>{
    //sendOTP to the email provided

    //Verify OTP,than move on and create your user

    const user = await User.create({...req.body})
    const token = user.createJWT()

    res.status(StatusCodes.CREATED).json({user:{name:user.firstname,surname:user.surname,email:user.email},token})
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
    res.status(StatusCodes.OK).json({user:{name:user.firstname,surname:user.surname,email:user.email},token})
}

//register business owner
const registerBusinessOwner=async(req,res)=>{
    console.log(req.body);
    const businessOwner = await BusinessOwner.create({...req.body})
    const token = businessOwner.createJWT()
    console.log(token);
    res.status(StatusCodes.CREATED).json({user:{name:businessOwner.firstname,surname:businessOwner.surname,email:businessOwner.email},token})
}

//login business owner
const loginBusinessOwner=async(req,res)=>{
    console.log(req.body);
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
    res.status(StatusCodes.OK).json({owner:{name:owner.firstname,surname:owner.surname,email:owner.email},token})
}

module.exports={registerUser,loginUser,registerBusinessOwner,loginBusinessOwner}