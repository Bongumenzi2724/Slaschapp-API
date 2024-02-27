const Auction=require('../models/AuctionSchema')

const {NotFoundError}=require('../errors')
const {StatusCodes}=require('http-status-codes')

const createAuction=async(req,res)=>{
    req.body.createdBy=req.user.userId;
    req.body.businessId=req.params.id;
    const auction = await Auction.create(req.body);
    res.status(StatusCodes.CREATED).json({auction});
}

const updateAuctions=async(req,res)=>{

   const{body:{campaignName,campaignDescription,campaignBudget,campaignDailyBudget,campaignStartDate,checkInStoreAvailability,percentageDiscount,interests,baitPlant:{name,descriptionBaitPlant,price,photos}},user:{userId},params:{auctionId:auctionId}}=req

    const auctionData=await Auction.findOneAndUpdate({_id:auctionId,createdBy:userId},req.body,{new:true,runValidators:true})
    
    if(campaignName==""||campaignDescription==""||campaignBudget==""||campaignDailyBudget==""||campaignStartDate==""||checkInStoreAvailability==""||percentageDiscount==""||interests==""||name==""||descriptionBaitPlant==""||price==""||photos==""){

        throw new BadRequestError("Fields cannot be empty please fill everything")
    }

    if(!business){
        throw new NotFoundError(`No Auction with id ${auctionId}`)
    }
    res.status(StatusCodes.OK).json({auctionData}) 
}

const getAllAuctions=async(req,res)=>{
    const auctionData=await Auction.find({createdBy:req.user.userId,businessId:req.params.id}).sort('createdAt')
    res.status(StatusCodes.OK).json({auctionData,count:auctionData.length});
}

const getSingleAuction=async(req,res)=>{

    const business= await Auction.findOne({_id:req.params.auctionId,createdBy:req.user.userId})

    if(!business){
        throw new NotFoundError(`No Business with id ${req.params.auctionId}`)
    }
    
    res.status(StatusCodes.OK).json({business})
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
module.exports={createAuction,getSingleAuction,auctionSearchResults,getAllAuctions,updateAuctions}