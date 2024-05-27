const { StatusCodes } = require("http-status-codes")
const Business=require('../models/BusinessRegistrationSchema')
const {BadRequestError,NotFoundError}=require('../errors')

//Create A Single Business
const createBusiness=async(req,res)=>{
    try{ 
        req.body.createdBy=req.user.userId; 
        const business=new Business({
            BusinessName:req.body.BusinessName,
            PhoneNumber:req.body.PhoneNumber,
            BusinessEmail:req.body.BusinessEmail,
            AcceptTermsAndConditions:req.body.AcceptTermsAndConditions,
            BusinessCategory:req.body.BusinessCategory,
            BusinessLocation:req.body.BusinessLocation,
            BusinessHours:req.body.BusinessHours,
            BusinessLogo:req.body.BusinessLogo,
            verificationDoc:req.body.verificationDoc,
            status:req.body.status,
            socials:req.body.socials,
            createdBy:req.user.userId
        });
        business.save(); 
        // const business=await Business.create({...req.body})
        return res.status(StatusCodes.CREATED).json({business:{business}});
    }catch(error){
        return res.status(500).status({status:false,message:error.message})
    }
}

//Get All Businesses Specific for A Single Business Owner Whose Status Is Active
const getAllBusinesses =async(req,res) =>{
    const businesses=await Business.aggregate([
        {
            $match:{status:"Active"}
        }
    ])
    return res.status(StatusCodes.OK).json({businesses,count:businesses.length})
}

//Get A Single Business For A Specific Owner check if the status of the business is active
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

//Change The Status of the Business but do not delete
const deleteBusiness=async(req,res)=>{

    const{user:{userId},params:{id:businessId}}=req
   try{
    //find the business by id
    const business=await Business.findById({_id:businessId,createdBy:userId});
    if(!business){
        throw new NotFoundError(`No Business With id ${businessId}`)
    }
    //update the status of the business 
    //get the status of the business
    business.status='Revoked'
    await Business.updateOneOne({_id:req.params.id},{$set:business},{new:true});
    return res.status(StatusCodes.OK).json({status:true,message:"Business Successfully Deleted"});
}catch(error){
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:false,message:error.message});
}
}
//Suspending A business
const suspendBusiness=async(req,res)=>{

    const{user:{userId},params:{id:businessId}}=req
   try{
    //find the business by id
    const business=await Business.findById({_id:businessId,createdBy:userId});
    if(!business){
        throw new NotFoundError(`No Business With id ${businessId}`)
    }
    //update the status of the business 
    //get the status of the business
    business.status='Suspended';

    await Business.updateOneOne({_id:req.prams.id},{$set:business},{new:true});

    return res.status(StatusCodes.OK).json({status:true,message:"Your Business Account Has Been Suspended"});
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

module.exports={createBusiness,searchBusiness,getSingleBusiness,updateBusinessDetails,getAllBusinesses,deleteBusiness}