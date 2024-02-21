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
    let match={}
    console.log(req.query.search)
    if(req.query.search){
        match.$or=[
            {campaignName: new RegExp(req.query.search,"i")},
            {campaignBudget: new RegExp(req.query.search,"i")},
            {interests: new RegExp(req.query.search,"i")}
        ]
    }
    const businessData=await Auction.aggregate([{$match:match}])
    if(!businessData){
        throw new NotFoundError("No Business Data Exist With That Format")
    } 
    console.log(businessData)
    res.status(StatusCodes.OK).json(businessData)
    //res.status(StatusCodes.OK).send("auction search route found")
}


module.exports={createAuction,auctionSearchResults}