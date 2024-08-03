const {NotFoundError} = require('../errors');
const AuctionSchema = require('../models/AuctionSchema');
const Bait = require('../models/BaitSchema');
const BusinessOwnerRegistration = require('../models/BusinessOwnerRegistration');
const Business=require('../models/BusinessRegistrationSchema')
const User=require('../models/UserRegistrationSchema')
const {StatusCodes}=require('http-status-codes')
//get single user
const getUserProfile=async(req,res)=>{
    const user= await User.findOne({_id:req.params.id})
    if(!user){
        throw new NotFoundError(`No user profile with id ${req.params.id} exist`)
    }
    return res.status(StatusCodes.OK).json({user})
};

//only active users
const getAllUsersProfiles=async(req,res)=>{
    //const AllUsers=await User.find({}).sort('createdAt')
    const AllUsers=await User.aggregate([{$project:{password:0,resetToken:0,resetTokenExpiration:0,__v:0,wallet:0,AcceptTermsAndConditions:0}}])
    return res.status(StatusCodes.OK).json({AllUsers,count:AllUsers.length});
};
//get all auctions feed
const getAllAuctions=async(req,res)=>{
    //i. Filter all auctions based on the aucquisition bid
    //ii.The highest acquisition bid is placed highest on the user feed

    const AllAuctions=await AuctionSchema.aggregate([{$sort:{acquisitionBid:-1}},{$match:{status:"Active"}},{$project:{updatedAt:0}}]);
    //const AllAuction=await AuctionSchema.aggregate([{$project:{updatedAt:0,createdAt:0,__v:0}},{$match:{status:"Active"}}]);
    const logged_in_user=User.findById({_id:req.user.userId});

    if(!logged_in_user){
        return res.status(404).json({message:"The user does not exist"});
    }
    const marketing_auctions=[];

    for(let j=0;j<AllAuctions.length-1;j++){

        //user location
        const user_location=logged_in_user.locationOrAddress.split(",").slice(-2).join(',').toLowerCase();
        //auction location
        const auctionLocation=AllAuctions[j].location.toLowerCase();
        //comapre the equality of the two strings
        const match=user_location===auctionLocation;

        if(match){

            //check the gender
            if(logged_in_user.gender.toLowerCase()===AllAuctions[j].gender.toLowerCase() || AllAuctions[j].gender==="All"){

                //check the interests
                //check the auction interests

                const auctionInterests=AllAuctions[j].interests.match(/([^,]+)/g);
                //check the user interests
                const userInterests=logged_in_user.interests.match(/([^,]+)/g);

                const hasMatch=auctionInterests.some(item=>userInterests.includes(item));

                if(hasMatch){
                    //push the auction into the array
                    marketing_auctions.push(AllAuctions[j]);
                }
            }
        }
    }
    return res.status(StatusCodes.OK).json({auctionFeed:marketing_auctions,count:AllAuctions.length});
};

//only active owners feed
const AllOwnersProfiles=async(req,res)=>{
    //const AllUsers=await User.find({}).sort('createdAt')
    const AllUsers=await BusinessOwnerRegistration.aggregate([{$project:{password:0,resetToken:0,resetTokenExpiration:0,__v:0,wallet:0,AcceptTermsAndConditions:0}}])
    return res.status(StatusCodes.OK).json({AllUsers,count:AllUsers.length});
};

const getAllBaits=async(req,res)=>{
    const baitsFeed=await Bait.find({});
    return res.status(StatusCodes.OK).json({baitsFeed,count:baitsFeed.length});
}

const getAllBaitsForUsers=async(req,res)=>{

    const baitsFeed=await Bait.find({auctionID:req.params.auctionID});
    return res.status(StatusCodes.OK).json({baitsFeed,count:baitsFeed.length});
}

//Get all active businesses 
const activeBusinessFeeds=async(req,res)=>{

     const activeBusinesses=await Business.aggregate([{$match:{status:'Active'}}]);
    if(!activeBusinesses){
        return res.status(StatusCodes.NOT_FOUND).json({message:"Businesses Not Found"});
    }
    return res.status(StatusCodes.OK).json({businesses:activeBusinesses});
}
module.exports={getUserProfile,getAllBaitsForUsers,activeBusinessFeeds,AllOwnersProfiles,getAllAuctions,getAllBaits,getAllUsersProfiles}