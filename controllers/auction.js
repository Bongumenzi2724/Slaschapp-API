const Auction=require('../models/AuctionSchema')
const {NotFoundError}=require('../errors')
const {StatusCodes}=require('http-status-codes')
const createAuction=async(req,res)=>{
    console.log(req.body);
    req.body.createdBy=req.user.userId
    const auction = await Auction.create(req.body)
    res.status(StatusCodes.CREATED).json({auction})
}

const auctionSearchResults=async(req,res)=>{
    console.log(req.params.key);
    req.body.createdBy=req.user.userId
    const auctionData = await Auction.find(
        {
            "$or":[
                {campaignName:{$regex:req.params.key}},
                {campaignBudget:{$regex:req.params.key}},
                {campaignStartDate:{$regex:req.params.key}},
            ]
        }
    )
    if(!businessData){
        throw new NotFoundError("No Business Data Exist With That Format")
    }
    res.status(StatusCodes.OK).json(auctionData)
}


module.exports={createAuction,auctionSearchResults}