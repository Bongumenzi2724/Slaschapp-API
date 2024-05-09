const {NotFoundError} = require('../errors')
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
const getAllUsersProfiles=async(req,res)=>{
    const AllUsers=await User.find({}).sort('createdAt')
    return res.status(StatusCodes.OK).json({AllUsers,count:AllUsers.length});
};

module.exports={getUserProfile,deleteUserProfile,updateUserProfile,getAllUsersProfiles}