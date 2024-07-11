const { NotFoundError } = require('../errors');
const Auction=require('../models/AuctionSchema');

const auctionVerification=async(req,res)=>{
    try {
        const{auctionID,userId}=req.body;

        console.log(req.body);

        //search for the auction
        const auction=await Auction.findOne({_id:auctionID});

        //const auctionID=(auction._id).toString();
        if(!auction){
            throw new NotFoundError(`No auction with id ${req.params.auctionId}`)
        }
        //const auctionID=(auction._id).toString();
        if(req.user.userId===userId && auctionID===(auction._id).toString()){
            return res.status(200).json({message:"Authorized to checkout",status:true});
        }else{
            return res.status(404).json({message:"Not Authorized To checkout",status:false});
        }
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

module.exports={auctionVerification}