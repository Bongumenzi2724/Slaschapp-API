const Cart = require("../models/Cart");
const User = require("../models/UserRegistrationSchema");
const mongoose=require('mongoose');
const generateOTP = require('../utils/generateOtp');
const { StatusCodes } = require("http-status-codes");
const sendEmail = require("../utils/sendEmail");
//done
const getAllPastCompletedOrders=async(req,res)=>{

    try {    
        const userId=(req.user.userId).toString();
        const status="Completed";
        const orders=await Cart.find({userId:userId,status:status});
        if(!orders){
            return res.status(StatusCodes.NOT_FOUND).json({message:"This user has no purchase history"})
        }
        if(orders.length===0){
            return res.status(StatusCodes.OK).json({message:"The user has 0 completed orders"})
        }
        else{
            return res.status(StatusCodes.OK).json({message:"All Past Orders Retrieved",orders:orders})
        }
       
        
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"an error occurred while viewing purchase history"})
    }  
}

const getAllPastOrders=async(req,res)=>{

    try {    
        const userId=(req.user.userId).toString();

        const orders=await Cart.find({userId:userId,status:{$en:"Completed"}});

        //const orders=await Cart.aggregate([{$match:{userId:userId,status:{$ne:"Completed"}}}]);

        console.log(orders);

        if(!orders){
            return res.status(StatusCodes.NOT_FOUND).json({message:"This user has no purchase history"})
        }
        if(orders.length===0){
            return res.status(StatusCodes.OK).json({message:"The user has 0 orders"})
        }
        else{
            return res.status(StatusCodes.OK).json({message:"All Past Orders Retrieved",orders:orders})
        }
       
        
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"an error occurred while viewing purchase history"})
    }  
}

const get_user_profile=async(req,res)=>{
    try{
    const user= await User.findOne({_id:req.params.id})
    if(!user){
        throw new NotFoundError(`No user profile with id ${req.params.id} exist`)
    }
    return res.status(StatusCodes.OK).json({user});
}
catch(error){
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Error Occured while fetching the user"});
}
}

const updateUserProfile=async(req,res)=>{
    try {
        const user=await User.find({_id:req.params.id});
        
        if(!user){
            return res.status(StatusCodes.NOT_FOUND).json({message:"The user does not exist"})
        }
   
        let newUser=await User.findByIdAndUpdate(req.params.id,req.body,{new:true});

        await newUser.save();

        const updatedUser=await User.aggregate([{$match:{_id:newUser._id}},{$project:{password:0,resetToken:0,resetTokenExpiration:0}}]);

        return res.status(StatusCodes.OK).json({updatedUser:updatedUser});

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:error.message})
    }
}

const deleteUserProfile=async(req,res)=>{
    try {
        const user=await User.find({_id:req.params.id});
        if(!user){
            return res.status(StatusCodes.NOT_FOUND).json({message:"The user does not exist"})
        }
        user.status="Revoked";
        let newUser=user;
        await User.findByIdAndUpdate(req.params.id,{$set:newUser},{new:true});
        await newUser.save();
        return res.status(StatusCodes.OK).json({message:"user profile deleted"})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:error.message})
    }
}

const suspendUserProfile=async(req,res)=>{
    try {
        const user=await User.find({_id:req.user.userId});
        if(!user){
            return res.status(StatusCodes.NOT_FOUND).json({message:"The user does not exist"})
        }
        user.status="Suspended";
        let newUser=user;
        await User.findByIdAndUpdate(req.params.id,{$set:newUser},{new:true});
        await newBusiness.save();
        return res.status(StatusCodes.OK).json({message:"User profile suspended"})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:error.message})
    }
}

const activateUserProfile=async(req,res)=>{
    try {
        const user=await User.find({_id:req.user.userId});
        if(!user){
            return res.status(StatusCodes.NOT_FOUND).json({message:"The user does not exist"})
        }
        user.status="Active";
        let newUser=user;
        await User.findByIdAndUpdate(req.params.id,{$set:newUser},{new:true});
        await newUser.save();
        return res.status(StatusCodes.OK).json({message:"user profile activated"})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:error.message})
    }
}

const userWalletUpdate=async(req,res)=>{
    
    try{
    //use this user id to search for the user to has his/her wallet
        const user =await User.findOne({_id:req.user.userId})
        if(!user){
            return res.status(StatusCodes.NOT_FOUND).json({message:"User does not exist"})
        }
        user.wallet=user.wallet+req.body.wallet;
        let newUser=user;
        await User.findByIdAndUpdate(req.user.userId,{$set:newUser},{new:true});
        await newUser.save();
        const otp=generateOTP();
        await sendEmail(user.email,otp);
        return res.status(StatusCodes.OK).json({message:`Wallet Updated successfully,new wallet is ${newUser.wallet}`});
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"An Error Occurred While Updating Your Wallet"})
    }
    

}

const user_completed_cart=async(req,res)=>{
    //solved
    try {
        //get all user completed cart 
        //const orders=await Cart.find({userId:req.user.userId});

        let userId=(req.user.userId).toString();

        const completed_orders=await Cart.aggregate([{$match:{status:'Completed',userId:userId}}]);
        
        if(!completed_orders){

            return res.status(StatusCodes.NOT_FOUND).json({message:"This user has no purchase history"})
        }
        return res.status(StatusCodes.OK).json({message:"All Past Orders Retrieved",completed_orders:completed_orders})
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

module.exports={getAllPastCompletedOrders,getAllPastOrders,user_completed_cart,updateUserProfile,activateUserProfile,get_user_profile,deleteUserProfile,suspendUserProfile,userWalletUpdate}

