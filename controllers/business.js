const { StatusCodes } = require("http-status-codes")
const Business=require('../models/BusinessRegistrationSchema')
const {BadRequestError,NotFoundError}=require('../errors')
const createBusiness=async(req,res)=>{

    console.log(req.body);
    req.body.createdBy=req.user.userId
    const business = await Business.create(req.body)
    res.status(StatusCodes.CREATED).json({business})

    //res.status(StatusCodes.ACCEPTED).json({business:{name:business.BusinessName,email:business.BusinessEmail}})
}
const getAllBusinesses =async(req,res) =>{
    
    const businesses=await Business.find({createdBy:req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({businesses,count:businesses.length})
    //res.send("Get All Businesses")
}

const getSingleBusiness=async(req,res)=>{

    const{user:{userId},params:{id:businessId}}=req

    const business= await Business.findOne({_id:businessId,createdBy:userId,})

    if(!business){
        throw new NotFoundError(`No Business with id ${businessId}`)
    }
    
    res.status(StatusCodes.OK).json({business})
    //res.send("Get Single Business Details")
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
    //res.send("Update Business")
}
const deleteBusiness=async(req,res)=>{

    const{user:{userId},params:{id:businessId}}=req

    const business=await Business.findByIdAndDelete({_id:businessId,createdBy:userId})

    if(!business){
        throw new NotFoundError(`No Business with id ${businessId}`)
    }

    res.status(StatusCodes.OK).send("Business Deleted Successfully")
    //res.send("Delete Business from Database")
}
module.exports={createBusiness,getSingleBusiness,updateBusinessDetails,getAllBusinesses,deleteBusiness}