const { StatusCodes } = require("http-status-codes")
const {BadRequestError,NotFoundError}=require('../errors');
const BusinessOwnerRegistration = require("../models/BusinessOwnerRegistration");
//update business owner details
const updateBusinessOwnerDetails=async(req,res)=>{

    const{body:{firstname,secondname,surname,profilePicture,phoneNumber,email,password,AcceptTermsAndConditions,locationOrAddress,birthday,IdNumber,IdDocumentLink,gender,resetToken,resetTokenExpiration},user:{userId},params:{id:ownerId}}=req
    if(firstname==""||secondname==""||surname==""||profilePicture==""||phoneNumber==""||email==""||password==""||AcceptTermsAndConditions==""||locationOrAddress==""||birthday==""||IdNumber==""||IdDocumentLink==""||gender==""){

        throw new BadRequestError("Fields cannot be empty please fill everything")
    }
    const businessOwner=await BusinessOwner.findByIdAndUpdate({_id:ownerId,createdBy:userId},req.body,{new:true,runValidators:true})
    if(!businessOwner){
        throw new NotFoundError(`No Business Owner with id ${ownerId}`)
    }
    res.status(StatusCodes.OK).json({businessOwner});
}
//delete or tag business owner
const deleteBusinessOwner=async(req,res)=>{
try{
    const{params:{id:ownerId}}=req
    const businessOwner=await BusinessOwnerRegistration.findById(ownerId);
    if(!businessOwner){
        throw new NotFoundError(`No Business Owner With id ${owneId}`)
    }
    await businessOwner.deleteOne({_id:businessOwner._id});
    return res.status(StatusCodes.OK).json({status:true,message:"Business Owner Successfully Deleted"});
}catch(error){
    return res.status(StatusCodes.OK).json({status:false,message:error.message});
}
}
//get all business owners available
const getAllBusinessOwners=async(req,res)=>{
    const businessOwners=await BusinessOwnerRegistration.find({}).sort('createdAt')
    res.status(StatusCodes.OK).json({businessOwners,count:businessOwners.length});
}
//get single business owner
const getSingleBusinessOwner=async(req,res)=>{

    const{params:{id:ownerId}}=req
    const businessOwner=await BusinessOwnerRegistration.findById({_id:ownerId})

    if(!businessOwner){
        throw new NotFoundError(`No Business Owner with id ${ownerId}`)
    }
    
    res.status(StatusCodes.OK).json({businessOwner})
}

module.exports={
    updateBusinessOwnerDetails
    ,deleteBusinessOwner
    ,getAllBusinessOwners
    ,getSingleBusinessOwner
}