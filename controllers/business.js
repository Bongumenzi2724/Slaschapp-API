const { StatusCodes } = require("http-status-codes")
const Business=require('../models/BusinessRegistrationSchema')
const BusinessOwner=require('../models/BusinessOwnerRegistration')
const {BadRequestError,NotFoundError}=require('../errors')

//create a new business owner
const createBusinessOwner=async(req,res)=>{
    //console.log(req.body);
    req.body.createdBy=req.user.userId
    try{ 
        //req.body.createdBy=req.user.userId;
        //.body.businessId=req.params.id;
        const result=await cloudinary.uploader.upload(req.file.path);
        req.body.profilePicture=result.secure_url;
        req.body.cloudinary_id=result.public_id; 
        const businessOwner=await BusinessOwner.create({...req.body})
        res.status(StatusCodes.CREATED).json({businessOwner:{businessOwner}});
    }catch(error){
        return res.status(500).status({status:false,message:error.message})
    }
}
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
    const businessOwner=await BusinessOwner.findById(ownerId);
    if(!businessOwner){
        throw new NotFoundError(`No Business Owner With id ${ownerId}`)
    }
    await cloudinary.uploader.destroy(businessOwner.cloudinary_id);
    await businessOwner.deleteOne({_id:req.prams.id});
    return res.status(StatusCodes.OK).json({status:true,message:"Business Owner Successfully Deleted"});
}catch(error){
    return res.status(StatusCodes.OK).json({status:false,message:error.message});
}
}
//get all business owners available
const getAllBusinessOwners=async(req,res)=>{
    // res.send("Get All The Business Owners");

    const businessOwners=await BusinessOwner.find({}).sort('createdAt')
    res.status(StatusCodes.OK).json({businessOwners,count:auctionData.length});
}
//get single business owner
const getSingleBusinessOwner=async(req,res)=>{

    const{user:{userId},params:{id:ownerId}}=req

    const businessOwner=await BusinessOwner.findById({_id:ownerId})

    if(!businessOwner){
        throw new NotFoundError(`No Business Owner with id ${ownerId}`)
    }
    
    res.status(StatusCodes.OK).json({businessOwner})
}

//Create A Single Business
const createBusiness=async(req,res)=>{
    try{ 
        req.body.createdBy=req.user.userId;
        const result=await cloudinary.uploader.upload(req.file.path);
        req.body.BusinessLogo=result.secure_url;
        req.body.cloudinary_id=result.public_id; 
        const business=await Business.create({...req.body})
        return res.status(StatusCodes.CREATED).json({business:{business}});
    }catch(error){
        return res.status(500).status({status:false,message:error.message})
    }
}
//Get All Businesses Specific for A Single Business Owner
const getAllBusinesses =async(req,res) =>{
    const businesses=await Business.find({createdBy:req.user.userId}).sort('createdAt')
    return res.status(StatusCodes.OK).json({businesses,count:businesses.length})
}
//Get A Single Business For A Specific Owner
const getSingleBusiness=async(req,res)=>{

    const{user:{userId},params:{id:businessId}}=req
    
    const business= await Business.findOne({_id:businessId,createdBy:userId})

    if(!business){
        throw new NotFoundError(`No Business with id ${businessId}`)
    }
    
    res.status(StatusCodes.OK).json({business})
}
//Update A Single Business
const updateBusinessDetails= async(req,res)=>{
    const{body:{BusinessName,PhoneNumber,BusinessEmail,AcceptTermsAndConditions,BusinessCategory,BusinessLocation,BusinessHours,verificationDoc,status,socials},user:{userId},params:{id:businessId}}=req
    if(BusinessName==""||PhoneNumber==""||BusinessEmail==""||AcceptTermsAndConditions==""||BusinessCategory==""||BusinessLocation==""||BusinessHours==""||verificationDoc==""||status==""||socials==""){

        throw new BadRequestError("Fields cannot be empty please fill everything")
    }
    const business=await Business.findOneAndUpdate({_id:businessId,createdBy:userId},req.body,{new:true,runValidators:true})
    if(!business){
        throw new NotFoundError(`No Business with id ${businessId}`)
    }

    res.status(StatusCodes.OK).json({business})

}
//Delete A Business
const deleteBusiness=async(req,res)=>{
    const{user:{userId},params:{id:businessId}}=req
   try{
    const business=await Business.findById({_id:businessId,createdBy:userId});
    if(!business){
        throw new NotFoundError(`No Business With id ${ownerId}`)
    }
    await cloudinary.uploader.destroy(business.cloudinary_id);
    await business.deleteOne({_id:req.prams.id});
    return res.status(StatusCodes.OK).json({status:true,message:"Business Successfully Deleted"});
}catch(error){
    return res.status(StatusCodes.OK).json({status:false,message:error.message});
}
}

//Search for businesses
const searchBusiness=async(req,res)=>{
    const{query:{BusinessCategory:BusinessCategory,BusinessLocation:BusinessLocation}}=req
    if(BusinessCategory||BusinessLocation){
        const businessData=await Business.aggregate([
            {
                $match:{
                    BusinessCategory:new RegExp(BusinessCategory,"i"),
                    BusinessLocation:new RegExp(BusinessLocation,"i")
                }
            }
        ])
        res.status(StatusCodes.OK).json(businessData)
    }
}

module.exports={createBusiness,searchBusiness,getSingleBusiness,updateBusinessDetails,getAllBusinesses,deleteBusiness,createBusinessOwner,updateBusinessOwnerDetails,deleteBusinessOwner,getSingleBusinessOwner,getAllBusinessOwners}