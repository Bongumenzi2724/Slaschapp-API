const Auction=require('../models/AuctionSchema')
const createAuction=async(req,res)=>{
    console.log(req.body);
    req.body.createdBy=req.user.userId
    const business = await Auction.create(req.body)
    res.status(StatusCodes.CREATED).json({business})
}

module.exports=createAuction