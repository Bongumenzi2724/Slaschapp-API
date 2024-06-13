const { StatusCodes } = require("http-status-codes")
const {BadRequestError,NotFoundError}=require('../errors');
const BusinessOwnerRegistration = require("../models/BusinessOwnerRegistration");
//update business owner details
const updateBusinessOwnerDetails=async(req,res)=>{
    try{
    const{body:{firstname,secondname,surname,profilePicture,phoneNumber,email,password,locationOrAddress,birthday,IdNumber,IdDocumentLink},user:{userId},params:{id:ownerId}}=req
    if(firstname==""||secondname==""||surname==""||profilePicture==""||phoneNumber==""||email==""||password==""||locationOrAddress==""||birthday==""||IdNumber==""||IdDocumentLink==""){

        throw new BadRequestError("Empty Fields Provided")
    }
    const businessOwner=await BusinessOwnerRegistration.findByIdAndUpdate({_id:ownerId,createdBy:userId},req.body,{new:true,runValidators:true})
    if(!businessOwner){
        throw new NotFoundError(`No Business Owner with id ${ownerId}`)
    }
    return res.status(StatusCodes.OK).json({businessOwner});

    }
    catch(error){
        return res.status(500).json({message:error.message})
    }
}

//delete or tag business owner
const deleteBusinessOwner=async(req,res)=>{
try{
    const{params:{id:ownerId}}=req
    const businessOwner=await BusinessOwnerRegistration.findById(ownerId);
    if(!businessOwner){
        throw new NotFoundError(`No Business Owner With id ${ownerId}`)
    }
    businessOwner.status='Revoked';
    let newBusinessOwner=business;
    await BusinessOwnerRegistration.updateOneOne({_id:req.params.id},{$set:newBusinessOwner},{new:true});
    return res.status(StatusCodes.OK).json({status:true,message:"Business Owner Successfully Deleted"});
}catch(error){
    return res.status(StatusCodes.OK).json({status:false,message:error.message});
}
}

//Suspend Business Owner Account
const suspendBusinessOwner=async(req,res)=>{
    try{
        const{params:{id:ownerId}}=req
        const businessOwner=await BusinessOwnerRegistration.findById(ownerId);
        if(!businessOwner){
            throw new NotFoundError(`No Business Owner With id ${ownerId}`)
        }
        businessOwner.status='Suspended';
        let newBusinessOwner=business;
        await BusinessOwnerRegistration.updateOneOne({_id:req.params.id},{$set:newBusinessOwner},{new:true});
        return res.status(StatusCodes.OK).json({status:true,message:"Business Owner Successfully Deleted"});
    }catch(error){
        return res.status(StatusCodes.OK).json({status:false,message:error.message});
    }
}
//update owner status
const ownerStatus=async(req,res)=>{
    try{
        const{params:{id:ownerId}}=req
        const businessOwner=await BusinessOwnerRegistration.findById(ownerId);
        if(!businessOwner){
            throw new NotFoundError(`No Business Owner With id ${ownerId}`)
        }
        businessOwner.status='Active';
        let newBusinessOwner=business;
        await BusinessOwnerRegistration.updateOneOne({_id:req.params.id},{$set:newBusinessOwner},{new:true});
        return res.status(StatusCodes.OK).json({status:true,message:"Business Owner Status Successfully Updated"});
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

module.exports={updateBusinessOwnerDetails,ownerStatus,suspendBusinessOwner,deleteBusinessOwner,getAllBusinessOwners,getSingleBusinessOwner}