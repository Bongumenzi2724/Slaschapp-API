const { StatusCodes } = require("http-status-codes")
const Business=require('../models/BusinessRegistrationSchema')
const {BadRequestError,NotFoundError}=require('../errors')

//Create A Single Business
const createBusiness=async(req,res)=>{
    try{ 
        req.body.createdBy=req.user.userId;; 
        if(req.body.BusinessName==false||req.body.PhoneNumber==false||req.body.BusinessEmail==false||req.body.AcceptTermsAndConditions==false||req.body.BusinessCategory==false||req.body.BusinessLocation==false||req.body.BusinessHours==false||req.body.BusinessLogo==false||req.body.BusinessType==false||req.body.BusinessBio==false||req.body.verificationDoc==false||req.body.status==false||req.body.socials==false){
            return res.status(StatusCodes.EXPECTATION_FAILED).json({message:"Please Provide All The Fields"})
        } 
        else{
        const business=new Business({
            BusinessName:req.body.BusinessName,
            PhoneNumber:req.body.PhoneNumber,
            BusinessEmail:req.body.BusinessEmail,
            AcceptTermsAndConditions:req.body.AcceptTermsAndConditions,
            BusinessCategory:req.body.BusinessCategory,
            BusinessLocation:req.body.BusinessLocation,
            BusinessHours:req.body.BusinessHours,
            BusinessLogo:req.body.BusinessLogo,
            BusinessType:req.body.BusinessType,
            BusinessBio:req.body.BusinessBio,
            verificationDoc:req.body.verificationDoc,
            status:req.body.status,
            socials:req.body.socials,
            createdBy:req.user.userId
        });
       
        business.save(); 
        //const business=await Business.create({...req.body})
        return res.status(StatusCodes.CREATED).json({business});
    }
    }catch(error){
        return res.status(500).status({status:false,message:error.message})
    }
}

//Get All Businesses Specific for A Single Business Owner Whose Status Is Active
const getAllBusinesses =async(req,res) =>{
    let userId=req.user.userId;
    const businesses=await Business.find({createdBy:userId})
    return res.status(StatusCodes.OK).json({businesses,count:businesses.length})
}

//Get A Single Business For A Specific Owner check if the status of the business is active
const getSingleBusiness=async(req,res)=>{

    const{params:{id:businessId}}=req
    
    const business= await Business.findOne({_id:businessId})

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
    business.status='Revoked';
    let newBusiness=business;
    await Business.findByIdAndUpdate(req.params.id,{$set:newBusiness},{new:true});
    await newBusiness.save();
    return res.status(StatusCodes.OK).json({status:true,message:"Business Successfully Deleted"});
}catch(error){
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:false,message:error.message});
}
}
//Suspending A business
const suspendBusiness=async(req,res)=>{

   try{
    const business=await Business.findById({_id:req.params.businessId,createdBy:req.user.userId});
    if(!business){
        throw new NotFoundError(`No Business With id ${req.params.businessId}`)
    }
    business.status='Suspended';
    let newBusiness=business;
    await Business.findByIdAndUpdate(req.params.id,{$set:newBusiness},{new:true});
    await newBusiness.save();
    return res.status(StatusCodes.OK).json({status:true,message:"Your Business Account Has Been Suspended"});
}catch(error){
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:false,message:error.message});
}
}

const activateBusiness=async(req,res)=>{

    try{
     const business=await Business.findById({_id:req.params.businessId,createdBy:req.user.userId});
     console.log(business)
     if(!business){
         throw new NotFoundError(`No Business With id ${req.params.businessId}`)
     }
     business.status='Active';
     let newBusiness=business;
     await Business.findByIdAndUpdate(req.params.id,{$set:newBusiness},{new:true});
     await newBusiness.save();
     return res.status(StatusCodes.OK).json({status:true,message:"Your Business Account Has Been Activated"});
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

module.exports={createBusiness,activateBusiness,searchBusiness,suspendBusiness,getSingleBusiness,updateBusinessDetails,getAllBusinesses,deleteBusiness}