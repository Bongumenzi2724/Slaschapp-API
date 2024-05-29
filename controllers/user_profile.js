const Cart = require("../models/Cart");
const User = require("../models/UserRegistrationSchema");
const { StatusCodes } = require("http-status-codes")

const getAllPastOrders=async(req,res)=>{
    try {    
        const orders=await Cart.find({userId:req.user.userId});
        if(!orders){
            return res.status(StatusCodes.NOT_FOUND).json({message:"This user has no purchase history"})
        }
        return res.status(StatusCodes.OK).json({message:"All Past Orders Retrieved",orders:orders})
        
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

const deleteUserProfile=async(req,res)=>{
    try {
        const user=await User.find({_id:req.params.id});
        if(!user){
            return res.status(StatusCodes.NOT_FOUND).json({message:"The user does not exist"})
        }
        user.status="Revoked";
        let newUser=user;
        await User.findByIdAndUpdate(req.params.id,{$set:newUser},{new:true});
        await newBusiness.save();
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

const walletUpdate=async(req,res)=>{
    
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
        return res.status(StatusCodes.OK).json({message:`Wallet Updated successfully,new wallet is ${newUser.wallet}`});
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"An Error Occurred While Updating Your Wallet"})
    }
    

}
module.exports={getAllPastOrders,activateUserProfile,get_user_profile,deleteUserProfile,suspendUserProfile,walletUpdate}

