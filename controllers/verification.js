const { NotFoundError } = require('../errors');
const Auction=require('../models/AuctionSchema');

const auctionVerification=async(req,res)=>{
    try {
        const{auctionID,userId}=req.body;
        const auction=await Auction.findOne({_id:auctionID});
        if(!auction){
            throw new NotFoundError(`No auction with id ${req.params.auctionId}`)
        }

        if(req.user.userId===userId){
            return res.status(200).json({message:"Authorized to checkout",status:true});
        }else{
            return res.status(404).json({message:"Not Authorized To checkout",status:false});
        }
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

module.exports={auctionVerification}