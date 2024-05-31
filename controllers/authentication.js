const {BadRequestError,UnauthenticatedError} = require('../errors')
const User=require('../models/UserRegistrationSchema')
const {StatusCodes}=require('http-status-codes')
const BusinessOwner=require('../models/BusinessOwnerRegistration')
const nodemailer=require('nodemailer');
const OTP=require('../models/OTPSchema')

//Nodemailer Stuff
const transporter=nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth:{
        user:"sender gmail account",
        pass:"sender gmail account password"
    }
});



const options={

}
//register app user
const registerUser= async(req,res)=>{
    
    try{ 
        const user=await User.create({...req.body})
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
    const transporter=nodemailer.createTransport({
        service:'gmail',
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth:{
            user:"sender gmail account",
            pass:"sender gmail account password"
        }
    });

    const options={
        from:{
            name:"Adlinc App",
            address:req.body.email,//sender email address
        }
    }

    if(req.body.firstname==false||req.body.secondname==false||req.body.surname==false||req.body.profilePicture==false||req.body.AcceptTermsAndConditions==false||req.body.phoneNumber==false||req.body.email==false||req.body.password==false||req.body.locationOrAddress==false||req.body.birthday==false||req.body.educationStatus==false||req.body.employmentStatus==false||req.body.gender==false||req.body.interests==false||req.body.status==false||req.body.status==false){
        return res.status(StatusCodes.EXPECTATION_FAILED).json({message:"Please Provide All The Fields"})
    } else{
    const user=await User.create({...req.body});
    const token=user.createJWT()
    return res.status(201).json({User:user,token:token,message:"Business Owner Registration"});
    }
}

const registerBusinessOwner=async(req,res)=>{

    try{ 
        if(req.body.firstname==false||req.body.secondname==false||req.body.surname==false||req.body.profilePicture==false||req.body.AcceptTermsAndConditions==false||req.body.phoneNumber==false||req.body.email==false||req.body.password==false||req.body.locationOrAddress==false||req.body.birthday==false||req.body.IdNumber==false||req.body.IdDocumentLink==false||req.body.gender==false||req.body.status==false){
            return res.status(StatusCodes.EXPECTATION_FAILED).json({message:"Please Provide All The Fields"})
        } 
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
        return res.status(201).json({BusinessOwner:newOwner,token:token});
    }catch(error){
        return res.status(500).status({status:false,message:error.message})
    }
}

module.exports={registerUser,loginUser,UserRegistration,loginBusinessOwner,registerBusinessOwner,userVerification}