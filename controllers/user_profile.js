const Cart = require("../models/Cart");
const User = require("../models/UserRegistrationSchema");
const { StatusCodes } = require("http-status-codes")

const getAllPastOrders=async(req,res)=>{
   
    try {  
        console.log(req.user);   
        const orders=await Cart.find({userId:req.user.userId});
        if(!orders){
            return res.status(StatusCodes.NOT_FOUND).json({message:"This user has no purchase history"})
        }
        return res.status(StatusCodes.OK).json({message:"All Past Orders Retrieved",orders:orders})
        
    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({message:"an error occurred while viewing purchase history"})
    }
    
}

const get_user_profile=async(req,res)=>{
    console.log("Get Single Profile");
    return res.status(StatusCodes.OK).json({message:"User Retrieved"})
}
const deleteUserProfile=async(req,res)=>{
    try {
        const user=await User.find({_id:req.user.userId});
        if(!user){
            return res.status(StatusCodes.NOT_FOUND).json({message:"The user does not exist"})
        }
        user.status="Revoked";
        let newUser=user;
        await User.updateOne(req.user.userId,{$set:newUser},{new:true});
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
        await User.updateOne(req.user.userId,{$set:newUser},{new:true});
        return res.status(StatusCodes.OK).json({message:"User profile suspended"})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:error.message})
    }
}

module.exports={getAllPastOrders,get_user_profile,deleteUserProfile,suspendUserProfile}

