const { StatusCodes } = require("http-status-codes")
const Business=require('../models/BusinessRegistrationSchema')
const BusinessOwner=require('../models/BusinessOwnerRegistration')
const {BadRequestError,NotFoundError}=require('../errors')

//create a new business owner
const createBusinessOwner=async(req,res)=>{
    //console.log(req.body);
    req.body.createdBy=req.user.userId
    const businessOwner = await BusinessOwner.create(req.body);
    return res.status(StatusCodes.CREATED).json({businessOwner});
}
//update business owner details
const updateBusinessOwnerDetails=async(req,res)=>{
    //res.send('Update business owner details')

    const{body:{firstname,secondname,surname,profilePicture,businessOwnerLogo,phoneNumber,email,password,locationOrAddress,birthday,educationStatus,employmentStatus},user:{userId},params:{id:ownerId}}=req

    const businessOwner=await Business.findOneAndUpdate({_id:ownerId,createdBy:userId},req.body,{new:true,runValidators:true})
    
    if(firstname==""||secondname==""||surname==""||profilePicture==""||businessOwnerLogo==""||phoneNumber==""||email==""||password==""||locationOrAddress==""||birthday==""||educationStatus==""||employmentStatus==""){

        throw new BadRequestError("Fields cannot be empty please fill everything")
    }

    if(!businessOwner){
        throw new NotFoundError(`No Business with id ${ownerId}`)
    }

    res.status(StatusCodes.OK).json({businessOwner});
}
//delete or tag business owner
const deleteBusinessOwner=async(req,res)=>{
    //res.send('delete business owner');

    const{user:{userId},params:{id:ownerId}}=req

    const business=await BusinessOwner.findByIdAndDelete({_id:ownerId,createdBy:userId})

    if(!business){
        throw new NotFoundError(`No Business Owner With Id ${ownerId} Exist`)
    }

    res.status(StatusCodes.OK).send("Business Owner Deleted Successfully")
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

    const businessOwner=await BusinessOwner.findOne({_id:ownerId,createdBy:userId})

    if(!businessOwner){
        throw new NotFoundError(`No Business Owner with id ${ownerId}`)
    }
    
    res.status(StatusCodes.OK).json({businessOwner})
}

//Create A Single Business
const createBusiness=async(req,res)=>{
    req.body.createdBy=req.user.userId
    const business = await Business.create(req.body)
    return res.status(StatusCodes.CREATED).json({business,businessId:business._id})
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

    const{body:{BusinessName,PhoneNumber,BusinessEmail,BusinessLocation,BusinessHours},user:{userId},params:{id:businessId}}=req

    const business=await Business.findOneAndUpdate({_id:businessId,createdBy:userId},req.body,{new:true,runValidators:true})
    
    if(BusinessName==""||PhoneNumber==""||BusinessEmail==""||BusinessLocation==""||BusinessHours==""){

        throw new BadRequestError("Fields cannot be empty please fill everything")
    }

    if(!business){
        throw new NotFoundError(`No Business with id ${businessId}`)
    }

    res.status(StatusCodes.OK).json({business})

}
//Delete A Business
const deleteBusiness=async(req,res)=>{

    const{user:{userId},params:{id:businessId}}=req

    const business=await Business.findByIdAndDelete({_id:businessId,createdBy:userId})

    if(!business){
        throw new NotFoundError(`No Business with id ${businessId}`)
    }

    res.status(StatusCodes.OK).send("Business Deleted Successfully")
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