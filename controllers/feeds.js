const {NotFoundError} = require('../errors');
const AuctionSchema = require('../models/AuctionSchema');
const BusinessOwnerRegistration = require('../models/BusinessOwnerRegistration');
const User=require('../models/UserRegistrationSchema')
const {StatusCodes}=require('http-status-codes')
//get single user
const getUserProfile=async(req,res)=>{
    const user= await User.findOne({_id:req.params.id})
    if(!user){
        throw new NotFoundError(`No user profile with id ${req.params.id}`)
    }
    return res.status(StatusCodes.OK).json({user})
};
//delete single user
const deleteUserProfile=async(req,res)=>{
     //Find user by id
     try{
     const user = await User.findById(req.params.id);
     if(!user){
        throw new NotFoundError(`No user profile with id ${req.params.id}`);
    }
    await user.deleteOne({_id:req.params.id});
    return res.status(StatusCodes.OK).json({status:true,message:"Business Deleted Successfully"})
}catch(error){
    return res.status(500).json({status:false,message:error.message});
}
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
    const AllAuction=await AuctionSchema.aggregate([{$project:{updatedAt:0,createdAt:0,__v:0}}])
    return res.status(StatusCodes.OK).json({feed:AllAuction,count:AllAuction.length});
};

//only active owners feed
const AllOwnersProfiles=async(req,res)=>{
    //const AllUsers=await User.find({}).sort('createdAt')
    const AllUsers=await BusinessOwnerRegistration.aggregate([{$project:{password:0,resetToken:0,resetTokenExpiration:0,__v:0,wallet:0,AcceptTermsAndConditions:0}}])
    return res.status(StatusCodes.OK).json({AllUsers,count:AllUsers.length});
};
module.exports={getUserProfile,AllOwnersProfiles,getAllAuctions,deleteUserProfile,updateUserProfile,getAllUsersProfiles}