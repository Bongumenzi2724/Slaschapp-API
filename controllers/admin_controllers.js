const User=require('../models/UserRegistrationSchema')
const Auction=require('../models/AuctionSchema')
const Business=require('../models/BusinessRegistrationSchema')
const BusinessOwner=require('../models/BusinessOwnerRegistration')
const Bait = require('../models/BaitSchema');
const Cart=require('../models/Cart');
const CashOut=require('../models/CashOutRequests');
const {StatusCodes}=require('http-status-codes')
const { create_category, get_all_categories } = require('./categories_controllers')
const { getAllUsersProfiles,getUserProfile } = require('./feeds')

const { update_bait_plant } = require('./bait_plant_controllers');
const { admin_get_all_requests, admin_get_status_requests } = require('./transaction_controller');

//get all users
const AllUsers=async(req,res)=>{
    try {
        const AllUsers=await User.aggregate([{$project:{password:0,resetToken:0,resetTokenExpiration:0,__v:0,wallet:0,AcceptTermsAndConditions:0,updatedAt:0}}]);
        if(AllUsers.length===0){
            return res.status(200).json({message:"No users is registered"});
        }
        res.status(StatusCodes.OK).json({AllUsers:AllUsers,count:AllUsers.length});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}
//get all business owners
const AllBusinessOwners=async(req,res)=>{
    try {
        const BusinessOwnersData=await BusinessOwner.aggregate([{$project:{password:0,__v:0,resetToken:0,resetTokenExpiration:0,IdNumber:0,AcceptTermsAndConditions:0,updatedAt:0}}]);
        if(BusinessOwnersData.length===0){
            return res.status(200).json({message:"No business owner is registered"})
        }
        res.status(StatusCodes.OK).json({BusinessOwnersData,count:BusinessOwnersData.length});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}
//get all business
const AllBusiness=async(req,res)=>{
    try {
        const businesses=await Business.find({}).sort('createdAt')
        if(businesses.length===0){
            return res.status(200).json({status:true,message:"No business is registered"})
        }
        res.status(StatusCodes.OK).json({businesses,count:businesses.length});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}
//get all auctions
const AllAuctions=async(req,res)=>{
    const auctionData=await Auction.find({}).sort('createdAt')
    res.status(StatusCodes.OK).json({auctionData,count:auctionData.length});
}
//get all bait plants
const AllBaitPlants=async(req,res)=>{
    try {
       const bait = await Bait.find({})
       if(bait.length===0){
        return res.status(StatusCodes.OK).json({message:"No baits exist in the platform At the moment"})
       }
       return res.status(StatusCodes.OK).json(bait)
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:false,message:error.message})
    }
}
//get all carts
const AllCarts=async(req,res)=>{
    try {
        const carts = await Cart.aggregate([{$project:{baits:0,__v:0,userId:0,createdAt:0,updatedAt:0}}])
        if(carts.length===0){
            return res.status(200).json({message:"No orders exists in the platform currently"})
        }
        return res.status(StatusCodes.OK).json({orders:carts})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:false,message:error.message})
    }
}
//get all past orders
const getAllPastOrders=async(req,res)=>{
    try {
        const orders=await Cart.find({userId:req.params.userId});

        if(!orders){
            return res.status(StatusCodes.NOT_FOUND).json({message:"This user has no purchase history"})
        }
        return res.status(StatusCodes.OK).json({message:"All Past Orders Retrieved",orders:orders})
        
    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({message:"No Purchase History Exist In The System"})
    }
    
}
//get all cash out requests
const getAllCashOutRequests=async(req,res)=>{
    try {
        const cash_out=await CashOut.find({});

        if(!cash_out){
            return res.status(StatusCodes.NOT_FOUND).json({message:"No cash out requests exist currently"});
        }
        return res.status(StatusCodes.OK).json({message:"Cash out requests",cash_out:cash_out})
        
    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({message:error.message});
    }
}
//suspend auction
const suspendAuction=async(req,res)=>{
    try{
    const auction= await Auction.findById({_id:req.params.auctionId});

    if(!auction){
        throw new NotFoundError(`No Auction with id ${req.params.auctionId}`)
    }
    //update the auction status
    auction.status='Revoked';
    let newAuction=auction;
    await Auction.findByIdAndUpdate(req.params.id,{$set:newAuction},{new:true});
    await newAuction.save();
    res.status(StatusCodes.OK).json({message:"This Auction Has Been Suspended"});
}catch(error){
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:false,message:error.message});
}
}
//suspend business
const suspendBusiness=async(req,res)=>{

    try{
     const business=await Business.findById({_id:req.params.businessId});
     if(!business){
         throw new NotFoundError(`No Business With id ${req.params.businessId}`)
     }
     business.status='Suspended';
     let newBusiness=business;
     await Business.findByIdAndUpdate(req.params.businessId,{$set:newBusiness},{new:true});

     await newBusiness.save();

     return res.status(StatusCodes.OK).json({status:true,message:"Your Business Account Has Been Suspended"});
 }catch(error){
     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:false,message:error.message});
 }
 }
//suspend user
const suspendUserProfile=async(req,res)=>{
    try {
        const user=await User.find({_id:req.params.userId});
        if(!user){
            return res.status(StatusCodes.NOT_FOUND).json({message:"The user does not exist"})
        }
        user.status="Suspended";
        let newUser=user;
        await User.findByIdAndUpdate(req.params.userId,{$set:newUser},{new:true});
        await newBusiness.save();
        return res.status(StatusCodes.OK).json({message:"User profile suspended"})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:error.message})
    }
}
//activate auction
const activateAuction=async(req,res)=>{
    //search for the auction using the auction id
    const auction=await Auction.findOne({_id:req.params.auctionId});
    if(!auction){
        return res.status(StatusCodes.NOT_FOUND).json({message:`Auction with ID ${req.params.auctionId} does not exist`});
    }
    
    auction.status='Active';
    let newAuction=auction;
    await Auction.findByIdAndUpdate(req.params.id,{$set:newAuction},{new:true});
     await newAuction.save();
    res.status(StatusCodes.OK).json({message:"Auction Status Activated Successfully"})
}
//activate business
const activateBusiness=async(req,res)=>{

    try{
        const {newStatus}=req.body;
        const business=await Business.findById({_id:req.params.businessId});

        //console.log(business)
        if(!business){
             throw new NotFoundError(`No Business With id ${req.params.businessId}`)
        }
        business.status=newStatus;
        let newBusiness=business;
        await Business.findByIdAndUpdate(req.params.id,{$set:newBusiness},{new:true});
        await newBusiness.save();
        return res.status(StatusCodes.OK).json({status:true,message:"Your Business Account Has Been Activated"});
    }catch(error){
        return res.status(StatusCodes.OK).json({status:false,message:error.message});
 }
 }

//activate user
const activateUserProfile=async(req,res)=>{
    try {
        const {newStatus}=req.body;
        const user=await User.findById({_id:req.params.userId});
        if(!user){
            return res.status(StatusCodes.NOT_FOUND).json({message:"The user does not exist"})
        }
        user.status=newStatus;
        let newUser=user;
        await User.findByIdAndUpdate(req.params.userId,{$set:newUser},{new:true});
        await newUser.save();
        return res.status(StatusCodes.OK).json({message:"user profile activated"})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:error.message})
    }
}

//activate owner
const activateOwnerProfile=async(req,res)=>{
    try {
        const{newStatus}=req.body;
        const owner=await BusinessOwner.findById({_id:req.params.owner_id});
        if(!owner){
            return res.status(StatusCodes.NOT_FOUND).json({message:"The owner does not exist"})
        }
        owner.status=newStatus;
        let newOwner=owner;
        await BusinessOwner.findByIdAndUpdate(req.params.owner_id,{$set:newOwner},{new:true});
        await newOwner.save();
        return res.status(StatusCodes.OK).json({status:true,message:"Your Business Owner Account Has Been Activated"})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:error.message})
    }
}
module.exports={AllUsers,getAllCashOutRequests,activateOwnerProfile,activateUserProfile,activateAuction,activateBusiness,suspendAuction,suspendUserProfile,suspendBusiness,AllCarts,AllBaitPlants,getAllPastOrders,AllBusiness,AllAuctions,AllBusinessOwners,get_all_categories,create_category,getAllUsersProfiles,update_bait_plant,getUserProfile,admin_get_status_requests,admin_get_all_requests}