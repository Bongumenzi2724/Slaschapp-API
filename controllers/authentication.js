const {BadRequestError,UnauthenticatedError} = require('../errors')
const User=require('../models/UserRegistrationSchema')
const {StatusCodes}=require('http-status-codes')
const BusinessOwner=require('../models/BusinessOwnerRegistration')
const nodemailer=require('nodemailer');
const otpGenerator=require('otp-generator');
const bcrypt = require('bcrypt')

//register app user
const registerUser= async(req,res)=>{
    
    try{ 
        const newUser=new User({
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
            wallet:req.body.wallet,
            //otp:req.body.otp,
            verified:false,
            resetToken:req.body.resetToken,
            resetTokenExpiration:req.body.resetTokenExpiration,
            status:req.body.status
        });

        newUser.save();

        const token=newUser.createJWT();
        return res.status(201).json({User:user,token:token});
       /*  const user=await User.create({...req.body})
        const token=user.createJWT();
        return res.status(201).json({User:user,token:token});  */

    }catch(error){
        console.log(req.body)
        return res.status(500).status({status:false,message:error.message})
    }
}


//login app user
const loginUser=async(req,res)=>{

    const {email,password}=req.body;
    if(!email||!password){
        throw new BadRequestError("Please provide email and password");
    }
    const user= await User.findOne({email:email});

    if(!user){
        throw new UnauthenticatedError('Invalid Email');
    }
     const token = user.createJWT();

    res.status(StatusCodes.OK).json({owner:{id:user._id,name:user.firstname,surname:user.surname,wallet:user.wallet,email:user.email},token:{token}});
    
    //const hashedPassword=await user.PasswordHash(password);
    //console.log("Login Password");
    //console.log();
    //console.log(hashedPassword)
    /* if(hassedPassword===user.password){

    } */

    //console.log("Exist Password");
    //console.log(user.password);
    
    //const isPasswordCorrect= await user.comparePassword(hashedPassword);
    /*
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid Password');
    }
    */
    //const token = user.createJWT();

    //res.status(StatusCodes.OK).json({owner:{id:user._id,name:user.firstname,surname:user.surname,wallet:user.wallet,email:user.email},token:{token}}) 
     
}

const loginBusinessOwner=async(req,res)=>{

    const {email,password}=req.body;

    if(!email||!password){
        throw new BadRequestError("Please provide email and password");
    }
    const owner= await BusinessOwner.findOne({email});

    if(!owner){
        throw new UnauthenticatedError('Invalid Email');
    }
   
    const isPasswordCorrect= await owner.comparePassword(password);

    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid Password');
    }
    const token = owner.createJWT();

    res.status(StatusCodes.OK).json({owner:{id:owner._id,name:owner.firstname,surname:owner.surname,wallet:owner.wallet,email:owner.email},token:{token}})
}


const UserRegistration=async(req,res)=>{
    if(req.body.firstname==false||req.body.secondname==false||req.body.surname==false||req.body.profilePicture==false||req.body.AcceptTermsAndConditions==false||req.body.phoneNumber==false||req.body.email==false||req.body.password==false||req.body.locationOrAddress==false||req.body.birthday==false||req.body.educationStatus==false||req.body.employmentStatus==false||req.body.gender==false||req.body.interests==false||req.body.status==false||req.body.status==false){
        return res.status(StatusCodes.EXPECTATION_FAILED).json({message:"Please Provide All The Fields"})
    } 

    else{
        //generate the otp 
       // const otpCode=otpGenerator.generate(4, { upperCaseAlphabets: false,digits:true,specialChars: false,lowerCaseAlphabets:false });
        //req.body.otp=otpCode;
        //send the otp to user
        /*const transporter=nodemailer.createTransport({
            service:'gmail',
            port:587,
            secure:false,
            auth:{
                user:'nuenginnovations@gmail.com',
                pass:'uoby xoot pebo fwrx'
            }
        });*/
        /*const mailOptions={
            from:'nuenginnovations@gmail.com',
            to:req.body.email,
            subject:'Verify Email',
            text:`Your OTP code is:${req.body.otp}`
        };*/
        /*transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                //console.log(error);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:'Error Sending Email'})
            }
            else{
                console.log("OTP Sent Successfully");
            }
        })
        */
        
        //create a new user
        
      
        const registeredUser=await User.create({...req.body});
        const token=registeredUser.createJWT();
        const password=await registeredUser.PasswordHash(req.body.password);
        registeredUser.password=password;
        let newUser=registeredUser;
        await User.findByIdAndUpdate({_id:(registeredUser._id).toString()},{$set:newUser},{new:true});
        await newUser.save();
        //console.log(newUser.password);
        return res.status(201).json({User:newUser,token:token});
    }
}


const registerBusinessOwner=async(req,res)=>{

    try{ 
        if(req.body.firstname==false||req.body.secondname==false||req.body.surname==false||req.body.profilePicture==false||req.body.AcceptTermsAndConditions==false||req.body.phoneNumber==false||req.body.email==false||req.body.password==false||req.body.locationOrAddress==false||req.body.birthday==false||req.body.IdNumber==false||req.body.IdDocumentLink==false||req.body.gender==false||req.body.wallet==false||req.body.status==false){

            return res.status(StatusCodes.EXPECTATION_FAILED).json({message:"Please Provide All The Fields"})
        } 

       // const otpCode=otpGenerator.generate(4, { upperCaseAlphabets: false,digits:true,specialChars: false,lowerCaseAlphabets:false });
        
       //req.body.otp=otpCode;
        //send the otp to user

        /*const transporter=nodemailer.createTransport({
            service:'gmail',
            port:587,
            secure:false,
            auth:{
                user:'nuenginnovations@gmail.com',
                pass:'uoby xoot pebo fwrx'
            }
        });*/
        
        /*const mailOptions={
            from:'nuenginnovations@gmail.com',
            to:req.body.email,
            subject:'Verify Email',
            text:`Your OTP code is:${req.body.otp}`
        };*/

        
       /* transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                //console.log(error);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:'Error Sending Email'})
            }
            else{
                //console.log("OTP Sent Successfully");
            }
        });*/

     /*   const newOwner=new BusinessOwner({
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
            wallet:req.body.wallet,
            //otp:req.body.otp,
            verified:false,
            resetToken:req.body.resetToken,
            resetTokenExpiration:req.body.resetTokenExpiration,
            status:req.body.status
        });

        newOwner.save();

        const token=newOwner.createJWT();
        */

        const newOwner=await BusinessOwner.create({...req.body})
        const token=newOwner.createJWT();
        return res.status(201).json({BusinessOwner:newOwner,token:token});

    }catch(error){
        return res.status(500).status({status:false,message:error.message})
    }
}

module.exports={registerUser,loginUser,UserRegistration,loginBusinessOwner,registerBusinessOwner}