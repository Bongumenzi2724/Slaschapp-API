const Auction=require('../models/AuctionSchema')
const {NotFoundError}=require('../errors')
const {StatusCodes}=require('http-status-codes')


const createAuction=async(req,res)=>{
    req.body.businessId=req.params.businessId;
    if(req.body.campaignName==false||req.body.campaignBudget==false||req.body.campaignDailyBudget==false||req.body.campaignDescription==false||req.body.campaignStartDate==false||req.body.interests==false||req.body.age==false||req.body.location==false||req.body.birthdays==false||req.body.languages==false){
        return res.status(StatusCodes.EXPECTATION_FAILED).json({message:"Please Provide All The Fields"})
    } 
    else{
        const newAuction=await Auction.create({...req.body});
        return res.status(StatusCodes.CREATED).json({newAuction});
    } 
}

const updateAuctions=async(req,res)=>{

   const{body:{campaignBudget,campaignDailyBudget,status},params:{auctionId:auctionId,businessId:businessId}}=req
   if(campaignBudget==""||campaignDailyBudget==""||campaignStartDate==""||status==""||age==""||location==""||languages==""){

    throw new BadRequestError("Fields cannot be empty please fill everything")
    }
    const auctionData=await Auction.findOneAndUpdate({_id:auctionId},req.body,{new:true,runValidators:true})
    if(!auctionData){
        throw new NotFoundError(`No Auction with id ${auctionId}`)
    }
    res.status(StatusCodes.OK).json({auctionData}) 
}

// Get all auctions who are 'active' 
const getAllAuctions=async(req,res)=>{
    const auctionData=await Auction.find({businessId:req.params.businessId})
    res.status(StatusCodes.OK).json({auctionData,count:auctionData.length});
}

const getSingleAuction=async(req,res)=>{

    const auctionData= await Auction.findOne({_id:req.params.auctionId})

    if(!auctionData){
        throw new NotFoundError(`No auction with id ${req.params.auctionId}`)
    }
    
    res.status(StatusCodes.OK).json({auctionData})
}

const deleteSingleAuction=async(req,res)=>{
    try{

    
    const auction= await Auction.findOne({_id:req.params.auctionId});

    if(!auction){
        throw new NotFoundError(`No Auction with id ${req.params.auctionId}`)
    }
    //update the auction status
    auction.status='Revoked';
    let newAuction=auction;
    await Auction.findByIdAndUpdate(req.params.auctionId,{$set:newAuction},{new:true});
    await newAuction.save();
    res.status(StatusCodes.OK).json({message:"Auction Deleted Successfully"})
    }catch(error){
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:false,message:error.message});
    }
}

//Suspend the account 
const suspendAuction=async(req,res)=>{
    try{
    const auction= await Auction.findById({_id:req.params.auctionId});

    if(!auction){
        throw new NotFoundError(`No Auction with id ${req.params.auctionId}`)
    }
    //update the auction status
    auction.status='Suspended';
    let newAuction=auction;
    await Auction.findByIdAndUpdate(req.params.id,{$set:newAuction},{new:true});
    await newAuction.save();
    res.status(StatusCodes.OK).json({message:"This Auction Has Been Suspended"});
}catch(error){
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:false,message:error.message});
}
}

const getAllAuctionMaterial=async(req,res)=>{
    const auctionData=await Auction.find({businessId:req.params.businessId}).sort('createdAt')
    res.status(StatusCodes.OK).json({auctionData,count:auctionData.length});
}

//activate auction
const activateAuction=async(req,res)=>{
    //search for the auction using the auction id
    const auction=await Auction.findOne({_id:req.params.auctionId});
    if(!auction){
        return res.status(StatusCodes.NOT_FOUND).json({message:`Auction with ID ${req.params.auctionId} does not exist`});
    }
    
    auction.status='Active';
    let newAuction=auction;
    await Auction.findByIdAndUpdate(req.params.id,{$set:newAuction},{new:true});
     await newAuction.save();
    res.status(StatusCodes.OK).json({message:"Auction Status Activated Successfully"})
}

const auctionSearchResults=async(req,res)=>{
    const{query:{campaignName:campaignName,campaignBudget}}=req
    if(campaignName||campaignBudget){
        const auctionData=await Auction.aggregate([
            {
                $match:{
                    campaignName:new RegExp(campaignName,"i"),
                    campaignBudget:new RegExp(campaignBudget,"i")
                }
            }
        ])
        res.status(StatusCodes.OK).json(auctionData)
    } 
}

/* const getAllBusinessesAunctions=async(req,res)=>{
    //use business id to search all auctions created by a business owner
    try {
        const auctionBusiness=await Auction.findById({_id:req.params.auctionId,businessId:req.params.businessId})
        if(!auctionBusiness){
            return res.status(StatusCodes.NOT_FOUND).json({message:"No Businesses Found"})
        }
        return res.status(StatusCodes.OK).json({auctionBusiness:auctionBusiness});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"An error occurred while fetching your businesses",error:error.message})
    }
} */

const auctionBusiness=async(req,res)=>{
    return res.status(StatusCodes.OK).json({message:"auction"})
}

module.exports={createAuction,activateAuction,auctionBusiness,suspendAuction,getSingleAuction,getAllAuctionMaterial,deleteSingleAuction,auctionSearchResults,getAllAuctions,updateAuctions}