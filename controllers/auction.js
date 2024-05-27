const Auction=require('../models/AuctionSchema')
const {NotFoundError}=require('../errors')
const {StatusCodes}=require('http-status-codes')
const { default: mongoose } = require('mongoose')

const createAuction=async(req,res)=>{
    req.body.createdBy=req.user.userId;
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

// Get all auctions who are 'active' 
const getAllAuctions=async(req,res)=>{
    console.log(req.user.userId)
    const auctionData=await Auction.aggregate([{
        $match:{status:'Active'}, 
    },
    {
        $project:{__v:0}
    }
])
    res.status(StatusCodes.OK).json({auctionData,count:auctionData.length});
}

const getSingleAuction=async(req,res)=>{

    const auctionData= await Auction.findOne({_id:req.params.auctionId,createdBy:req.user.userId})

    if(!auctionData){
        throw new NotFoundError(`No auction with id ${req.params.auctionID}`)
    }
    
    res.status(StatusCodes.OK).json({auctionData})
}
//Modify the status tag
const deleteSingleAuction=async(req,res)=>{
    try{
    const auction= await Auction.findById({_id:req.params.auctionId,createdBy:req.user.userId});

    if(!auction){
        throw new NotFoundError(`No Auction with id ${req.params.auctionId}`)
    }
    //update the auction status
    auction.status='Revoked';
    await Auction.updateOne({_id:req.params.id},{$set:{auction}},{new:true})
    res.status(StatusCodes.OK).json({message:"Business Deleted Successfully"})
    }catch(error){
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:false,message:error.message});
    }
}

//Suspend the account 
const suspendAuction=async(req,res)=>{
    try{
    const auction= await Auction.findById({_id:req.params.auctionId,createdBy:req.user.userId});

    if(!auction){
        throw new NotFoundError(`No Auction with id ${req.params.auctionId}`)
    }
    //update the auction status
    auction.status='Suspended';
    await Auction.updateOne({_id:req.params.id},{$set:{auction}},{new:true})
    res.status(StatusCodes.OK).json({message:"This Auction Has Been Suspended"});
}catch(error){
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:false,message:error.message});
}
}

const getAllAuctionMaterial=async(req,res)=>{
    const auctionData=await Auction.find({createdBy:req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({auctionData,count:auctionData.length});
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