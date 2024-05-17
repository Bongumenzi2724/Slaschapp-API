const User=require('../models/UserRegistrationSchema')
const Auction=require('../models/AuctionSchema')
const Business=require('../models/BusinessRegistrationSchema')
const BusinessOwner=require('../models/BusinessOwnerRegistration')
const Bait = require('../models/BaitSchema');
const {StatusCodes}=require('http-status-codes')
const { create_category, get_all_categories } = require('./categories_controllers')
const { getAllUsersProfiles, deleteUserProfile, getUserProfile } = require('./user_profile_controllers')
const { update_bait_plant } = require('./bait_plant_controllers')

const AllUsers=async(req,res)=>{
    const UsersData=await User.find({}).sort('createdAt')
    res.status(StatusCodes.OK).json({UsersData,count:UsersData.length});
}

const AllBusinessOwners=async(req,res)=>{
    const BusinessOwnersData=await BusinessOwner.find({}).sort('createdAt')
    res.status(StatusCodes.OK).json({BusinessOwnersData,count:BusinessOwnersData.length});
}

const AllBusiness=async(req,res)=>{
    const businesses=await Business.find({}).sort('createdAt')
    res.status(StatusCodes.OK).json({businesses,count:businesses.length});
}

const AllAuctions=async(req,res)=>{
    const auctionData=await Auction.find({}).sort('createdAt')
    res.status(StatusCodes.OK).json({auctionData,count:auctionData.length});
}

const AllBaitPlants=async(req,res)=>{
    try {
       const bait = await Bait.find({})
       return res.status(StatusCodes.OK).json(bait)
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:false,message:error.message})
    }
}
module.exports={AllUsers,AllBaitPlants,AllBusiness,AllAuctions,AllBusinessOwners,get_all_categories,create_category,getAllUsersProfiles,deleteUserProfile,update_bait_plant,getUserProfile}