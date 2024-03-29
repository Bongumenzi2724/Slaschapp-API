const {BadRequestError,UnauthenticatedError} = require('../errors')
const User=require('../models/UserRegistrationSchema')
const {StatusCodes}=require('http-status-codes')

const registerUser= async(req,res)=>{
    console.log(req.body)
    const user = await User.create({...req.body})
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({user:{name:user.firstname,surname:user.surname,email:user.email},token})
}

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

module.exports={registerUser,loginUser}


