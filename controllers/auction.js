const Auction=require('../models/AuctionSchema')
const {NotFoundError}=require('../errors')
const {StatusCodes}=require('http-status-codes')

const createAuction=async(req,res)=>{
    req.body.createdBy=req.user.userId;
    console.log(req.user)
    const newAuction=await Auction.create({...req.body});
    res.status(StatusCodes.CREATED).json({newAuction});
}

const updateAuctions=async(req,res)=>{

   const{body:{campaignName,campaignDescription,campaignBudget,campaignDailyBudget,campaignStartDate,interests},user:{userId},params:{auctionId:auctionId}}=req
   if(campaignName==""||campaignDescription==""||campaignBudget==""||campaignDailyBudget==""||campaignStartDate==""||interests==""){

    throw new BadRequestError("Fields cannot be empty please fill everything")
    }
    const auctionData=await Auction.findOneAndUpdate({_id:auctionId,createdBy:userId},req.body,{new:true,runValidators:true})
    if(!auctionData){
        throw new NotFoundError(`No Auction with id ${auctionId}`)
    }
    res.status(StatusCodes.OK).json({auctionData}) 
}

const getAllAuctions=async(req,res)=>{
    const auctionData=await Auction.find({createdBy:req.user.userId,businessId:req.params.id}).sort('createdAt')
    res.status(StatusCodes.OK).json({auctionData,count:auctionData.length});
}

const getSingleAuction=async(req,res)=>{

    const auction= await Auction.findOne({_id:req.params.auctionId,createdBy:req.user.userId})

    if(!auction){
        throw new NotFoundError(`No auction with id ${req.params.auctionID}`)
    }
    
    res.status(StatusCodes.OK).json({auction})
}

const deleteSingleAuction=async(req,res)=>{

    const auctionDelete= await Auction.findByIdAndDelete({_id:req.params.auctionId,createdBy:req.user.userId})

    if(!auctionDelete){
        throw new NotFoundError(`No Auction with id ${auctionId}`)
    }

    res.status(StatusCodes.OK).send("Business Deleted Successfully")
}

const getAllAuctionMaterial=async(req,res)=>{
    const AllAuctionData=await Auction.find({createdBy:req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({AllAuctionData,count:AllAuctionData.length});
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

module.exports={createAuction,getSingleAuction,getAllAuctionMaterial,deleteSingleAuction,auctionSearchResults,getAllAuctions,updateAuctions}