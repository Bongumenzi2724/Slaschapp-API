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
//update user
const updateUserProfile=async(req,res)=>{};
//only active users
const getAllUsersProfiles=async(req,res)=>{
    //const AllUsers=await User.find({}).sort('createdAt')
    const AllUsers=await User.aggregate([{$project:{password:0,resetToken:0,resetTokenExpiration:0,__v:0,wallet:0,AcceptTermsAndConditions:0}}])
    return res.status(StatusCodes.OK).json({AllUsers,count:AllUsers.length});
};
//get all auctions feed
const getAllAuctions=async(req,res)=>{
    //const AllUsers=await User.find({}).sort('createdAt')
    const AllAuction=await AuctionSchema.aggregate([{$project:{updatedAt:0,createdAt:0,__v:0}},{$match:{status:"Active"}}])
    return res.status(StatusCodes.OK).json({auctionFeed:AllAuction,count:AllAuction.length});
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
//Get all active businesses 
const activeBusinessFeeds=async(req,res)=>{
    console.log("Fetch Active Feeds")
     const activeBusinesses=await Business.aggregate([{$match:{status:'Active'}}]);
    if(!activeBusinesses){
        return res.status(StatusCodes.NOT_FOUND).json({message:"Businesses Not Found"});
    }
    return res.status(StatusCodes.OK).json({businesses:activeBusinesses});
}
module.exports={getUserProfile,activeBusinessFeeds,AllOwnersProfiles,getAllAuctions,getAllBaits,updateUserProfile,getAllUsersProfiles}