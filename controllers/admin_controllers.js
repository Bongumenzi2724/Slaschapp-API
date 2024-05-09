const User=require('../models/UserRegistrationSchema')
const Auction=require('../models/AuctionSchema')
const Business=require('../models/BusinessRegistrationSchema')
const BusinessOwner=require('../models/BusinessOwnerRegistration')
const {StatusCodes}=require('http-status-codes')
const { create_category, get_all_categories } = require('./categories_controllers')
const { getAllUsersProfiles, deleteUserProfile, getUserProfile } = require('./user_profile_controllers')
const { read_bait_plants, update_bait_plant } = require('./bait_plant_controllers')

const AllUsers=async(req,res)=>{
    const AllUsersData=await User.find({}).sort('createdAt')
    res.status(StatusCodes.OK).json({AllUsersData,count:AllUsersData.length});
}
const AllBusinessOwners=async(req,res)=>{
    const AllBusinessOwnerData=await BusinessOwner.find({}).sort('createdAt')
    res.status(StatusCodes.OK).json({AllBusinessOwnerData,count:AllBusinessOwnerData.length});
}
const AllBusiness=async(req,res)=>{
    const AllBusinessData=await Business.find({}).sort('createdAt')
    res.status(StatusCodes.OK).json({AllBusinessData,count:AllBusinessData.length});
}

const AllAuctions=async(req,res)=>{
    const AllAuctionData=await Auction.find({}).sort('createdAt')
    res.status(StatusCodes.OK).json({AllAuctionData,count:AllAuctionData.length});
}

module.exports={AllUsers,AllBusiness,AllAuctions,AllBusinessOwners,get_all_categories,create_category,getAllUsersProfiles,read_bait_plants,deleteUserProfile,update_bait_plant,getUserProfile}