const { StatusCodes } = require("http-status-codes")
const Business=require('../models/BusinessRegistrationSchema')
const {BadRequestError,NotFoundError}=require('../errors')

const createBusiness=async(req,res)=>{

    
    req.body.createdBy=req.user.userId
    const business = await Business.create(req.body)
    res.status(StatusCodes.CREATED).json({business})
}
const getAllBusinesses =async(req,res) =>{
    const{user:{userId},params:{id:businessId},query:{BusinessName:BusinessName,BusinessCategory:BusinessCategory,BusinessLocation:BusinessLocation}}=req
    
    if(BusinessName||BusinessCategory||BusinessLocation||BusinessCategory){
        const businessData=await Business.aggregate([
            {
                $match:{
                    BusinessName:new RegExp(BusinessName,"i"),
                    BusinessCategory:new RegExp(BusinessCategory,"i"),
                    BusinessLocation:new RegExp(BusinessLocation,"i")
                }
            }
        ])
        return res.status(StatusCodes.OK).json(businessData)
    }
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
}
const searchForBusinessDetails=async(req,res)=>{
    console.log(req.query)
    let matchArray={}
    if(req.query){
        req.body.createdBy=req.user.userId
        matchArray.$or=[
            {BusinessName: new RegExp(req.query.BusinessName,"i")},
            {BusinessCategory:new RegExp(req.query.BusinessCategory,"i")},
            {BusinessLocation: new RegExp(req.query.BusinessLocation,"i")}
        ]

    console.log(match)
    const businessData=await Business.aggregate([{$group:{_id:"$req.body.createdBy"}},{$match:"$matchArray"}])

    if(!businessData){
        throw new NotFoundError("No Business Data Exist With That Format")
    } 
    console.log(businessData)
    return res.status(StatusCodes.OK).json(businessData)
}
}

module.exports={createBusiness,getSingleBusiness,updateBusinessDetails,getAllBusinesses,deleteBusiness,searchForBusinessDetails}