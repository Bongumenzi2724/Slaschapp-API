const Auction=require('../models/AuctionSchema')

const {NotFoundError}=require('../errors')
const {StatusCodes}=require('http-status-codes')

const createAuction=async(req,res)=>{
    //console.log("This is what is sent: ", req.body)
    req.body.createdBy=req.user.userId;
    req.body.businessId=req.params.id;
    const auction = await Auction.create(req.body);
    console.log("This is the issue.....",auction._id)
    res.status(StatusCodes.CREATED).json({auction});
}

const updateAuctions=async(req,res)=>{

   const{body:{campaignName,campaignDescription,campaignBudget,campaignDailyBudget,campaignStartDate,checkInStoreAvailability,percentageDiscount,interests,baitPlant:{name,descriptionBaitPlant,price,photos}},user:{userId},params:{id:auctionId}}=req

    const auctionData=await Auction.findOneAndUpdate({_id:auctionId,createdBy:userId},req.body,{new:true,runValidators:true})
    
    if(campaignName==""||campaignDescription==""||campaignBudget==""||campaignDailyBudget==""||campaignStartDate==""||checkInStoreAvailability==""||percentageDiscount==""||interests==""||name==""||descriptionBaitPlant==""||price==""||photos==""){

        throw new BadRequestError("Fields cannot be empty please fill everything")
    }

    if(!business){
        throw new NotFoundError(`No Business with id ${auctionId}`)
    }
    res.status(StatusCodes.OK).json({auctionData}) 
}

const getAllAuctions=async(req,res)=>{
    const auctionData=await Auction.find({createdBy:req.user.userId,businessId:req.params.id}).sort('createdAt')
    res.status(StatusCodes.OK).json({auctionData,count:auctionData.length});
}

const auctionSearchResults=async(req,res)=>{

    const{user:{userId},params:{id:auctionId},query:{campaignName:campaignName,campaignBudget:campaignBudget,campaignStartDate:campaignStartDate}}=req
    if(campaignName==""&&campaignBudget==""&&campaignStartDate==""){
        throw new BadRequestError("Fill In At Least Two Characters")
    }
    if(campaignName||campaignBudget||campaignStartDate){
        const campaignData=await Auction.aggregate([
            {
                $match:{
                    Name:new RegExp(campaignName,"i"),
                    Budget:new RegExp(campaignBudget,"i"),
                    StartDate:new RegExp(campaignStartDate,"i")
                }
            }
        ])
        return res.status(StatusCodes.OK).json(campaignData)
    } 
}
module.exports={createAuction,auctionSearchResults,getAllAuctions,updateAuctions}