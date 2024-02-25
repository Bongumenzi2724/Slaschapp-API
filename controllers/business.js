const { StatusCodes } = require("http-status-codes")
const Business=require('../models/BusinessRegistrationSchema')
const {BadRequestError,NotFoundError}=require('../errors')

const createBusiness=async(req,res)=>{
    req.body.createdBy=req.user.userId
    const business = await Business.create(req.body)
    return res.status(StatusCodes.CREATED).json({business})
}
const getAllBusinesses =async(req,res) =>{
    
    const businesses=await Business.find({createdBy:req.user.userId}).sort('createdAt')
    return res.status(StatusCodes.OK).json({businesses,count:businesses.length})
}

const getSingleBusiness=async(req,res)=>{

    const{user:{userId},params:{id:businessId}}=req
    
    const business= await Business.findOne({_id:businessId,createdBy:userId,})

    if(!business){
        throw new NotFoundError(`No Business with id ${businessId}`)
    }
    
    res.status(StatusCodes.OK).json({business})
}

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

const deleteBusiness=async(req,res)=>{

    const{user:{userId},params:{id:businessId}}=req

    const business=await Business.findByIdAndDelete({_id:businessId,createdBy:userId})

    if(!business){
        throw new NotFoundError(`No Business with id ${businessId}`)
    }

    res.status(StatusCodes.OK).send("Business Deleted Successfully")
}

const searchBusiness=async(req,res)=>{
    const{user:{userId},params:{id:businessId},query:{BusinessCategory:BusinessCategory,BusinessLocation:BusinessLocation}}=req
    
    if(BusinessCategory||BusinessLocation){
        const businessData=await Business.aggregate([
            {
                $match:{
                    BusinessCategory:new RegExp(BusinessCategory,"i"),
                    BusinessLocation:new RegExp(BusinessLocation,"i")
                }
            }
        ])
        return res.status(StatusCodes.OK).json(businessData)
    }
}
module.exports={createBusiness,searchBusiness,getSingleBusiness,updateBusinessDetails,getAllBusinesses,deleteBusiness}