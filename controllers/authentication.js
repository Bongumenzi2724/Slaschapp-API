const {BadRequestError,UnauthenticatedError} = require('../errors')
const User=require('../models/UserRegistrationSchema')
const {StatusCodes}=require('http-status-codes')
const BusinessOwner=require('../models/BusinessOwnerRegistration')
const { default: mongoose } = require('mongoose');
const { MongoServerError } = require('mongodb');
const generateOtp=require('../utils/generateOtp');
const sendEmail=require('../utils/sendEmail');
const Admin=require('../models/AdminSchema');

//register app user
const registerUser= async(req,res)=>{

    try{  
        //generate the otp to send to the user
        const userOtp=generateOtp();
        await sendEmail(req.body.email,userOtp);
        req.body.otp=userOtp;
        const newUser=await User.create({...req.body});
        const result=await newUser.save();
        const token=newUser.createJWT();
        return res.status(201).json({User:result,token:token});

    }catch(error){
        return res.status(500).status({status:false,message:error})
    }
}

//login app user
const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const email1=email.toLowerCase();
        if(!email||!password){
            throw new BadRequestError("Please provide email and password");
        }
        const user= await User.findOne({email:email1});

        if(!user){
            throw new UnauthenticatedError('Invalid Email or Password');
        }
        const existingPassword=user.password;

        const isPasswordCorrect= await user.comparePassword(password,existingPassword);

        if(!isPasswordCorrect){
            throw new UnauthenticatedError('Invalid Email or Password');
        }
        const token = user.createJWT();
        
        return res.status(StatusCodes.OK).json({user:{id:user._id,name:user.firstname,surname:user.surname,wallet:user.wallet,email:user.email,rewards:user.rewards},token:{token}});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

//login business owner
const loginBusinessOwner=async(req,res)=>{

    const {email,password}=req.body;
    if(!email||!password){
        throw new BadRequestError("Please provide email and password");
    }
    const owner= await BusinessOwner.findOne({email:email});
    if(!owner){
        throw new UnauthenticatedError('Invalid Email or Password');
    }

   const hashedPassword=owner.password;

   const isPasswordCorrect= await owner.comparePassword(hashedPassword,password);

    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid Email or Password');
    }

    const token = owner.createJWT();

    res.status(StatusCodes.OK).json({owner:{id:owner._id,name:owner.firstname,surname:owner.surname,wallet:owner.wallet,email:owner.email},token:{token}})
}

//register app user
const UserRegistration=async(req,res)=>{

    try {
        if(req.body.firstname==false||req.body.secondname==false||req.body.surname==false||req.body.profilePicture==false||req.body.AcceptTermsAndConditions==false||req.body.phoneNumber==false||req.body.email==false||req.body.password==false||req.body.locationOrAddress==false||req.body.birthday==false||req.body.educationStatus==false||req.body.employmentStatus==false||req.body.gender==false||req.body.interests==false||req.body.status==false||req.body.status==false){
            return res.status(StatusCodes.EXPECTATION_FAILED).json({message:"Please Provide All The Fields"})
        } 
    
        else{
            //generate the otp 
            const otpCode=otpGenerator.generate(4, { upperCaseAlphabets: false,digits:true,specialChars: false,lowerCaseAlphabets:false });
            req.body.otp=otpCode;
            //send the otp to user
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
                to:req.body.email,
                subject:'Verify Email',
                text:`Your OTP code is:${req.body.otp}`
            };
            transporter.sendMail(mailOptions,(error,info)=>{
                if(error){
                    //console.log(error);
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:'Error Sending Email'})
                }
                else{
                    console.log("OTP Sent Successfully");
                }
            })
            
            //create a new user
            const registeredUser=(await User.create({...req.body})).validate((err)=>{
                if(err){
                    console.error(err);
                    return res.status(500).json({message:err});
                }
                else{
                    console.log("Validation Successfully");
                }
            });
            const token=registeredUser.createJWT();
            const userId=(registeredUser._id).toString()
            const returnedUser=await User.aggregate([{$match:{_id:new mongoose.Types.ObjectId(userId)}},{$project:{password:0,__v:0}}]);
            return res.status(201).json({User:returnedUser,token:token});
        }
    } catch (error) {

        if(error instanceof MongoServerError && error.code===11000){

            return res.status(11000).json({message:"Duplicate Email Found"});
        }else{

        }
    }
}
//register business owner
const registerBusinessOwner=async(req,res)=>{
    try{ 
        const ownerOtp=generateOtp();
        await sendEmail(req.body.email,ownerOtp);
        req.body.otp=ownerOtp;
        const newOwner=await BusinessOwner.create({...req.body});
        result=await newOwner.save();
        const token=newOwner.createJWT();
        return res.status(201).json({BusinessOwner:result,token:token});
    }catch(error){
            console.log(error);
            return res.status(409).json({message:errorMessage})
    }
}
//register administration
const registerAdmin=async(req,res)=>{
    try {
        const adminOtp=generateOtp();
        req.body.otp=adminOtp;
        await sendEmail(req.body.email,adminOtp);
        const admin=await Admin.create({...req.body});
        const result=await admin.save();
        const token=admin.createJWT();
        return res.status(201).json({admin:result,token:token,message:`email sent to ${admin.email} with OTP ${adminOtp} for verification`});
        
    } catch (error) {
        return res.status(500).status({status:false,message:error})
    }
}
//login administration
const loginAdmin=async(req,res)=>{

    try {
        const {email,password}=req.body;
        if(!email||!password){
            throw new BadRequestError("Please provide email and password");
        }
        const admin= await Admin.findOne({email:email});
        if(!admin){
            throw new UnauthenticatedError('Invalid Email or Password');
        }

        const existingPassword=admin.password;
    
        const isPasswordCorrect= await admin.comparePassword(password,existingPassword);
    
        if(!isPasswordCorrect){
            throw new UnauthenticatedError('Invalid Email or Password');
        }

        const token = admin.createJWT();
        
        return res.status(StatusCodes.OK).json({admin:{id:admin._id,name:admin.name,email:admin.email,wallet:admin.wallet},token:token});

    }
     catch (error) {
        return res.status(500).json({status:false,message:error.message});
    }
}

module.exports={registerUser,registerAdmin,loginAdmin,loginUser,UserRegistration,loginBusinessOwner,registerBusinessOwner}