const BaitSchema = require('../models/BaitSchema');
const cloudinary=require('../utils/cloudinary');
const {StatusCodes}=require('http-status-codes')
//create a bait plant
const create_bait_plant=async(req,res)=>{

   try{ 
    const result=await cloudinary.uploader.upload(req.file.path);
    req.body.photos=result.secure_url;
    req.body.cloudinary_id=result.public_id; 
    const baitPlant=await BaitSchema.create({...req.body})
    res.status(StatusCodes.CREATED).json({id:baitPlant._id,name:baitPlant.name,baitPlantDescription:baitPlant.baitPlantDescription,checkInStoreAvailability:baitPlant.checkInStoreAvailability,percentageDiscount:baitPlant.percentageDiscount,color:baitPlant.color,size:baitPlant.size,price:baitPlant.price,photos:baitPlant.photos});
}catch(error){
    return res.status(500).status({status:false,message:error.message})
}
}
//Update a bait plant
const update_bait_plant=async(req,res)=>{
    try {
        //Find bait by id in the database
       const bait = await BaitSchema.findById(req.params.id);
      if(req.file==undefined){
        newBait = await BaitSchema.findByIdAndUpdate(req.params.id,req.body,{new:true});
        return res.status(200).json({status:true,message:newBait})
       }
      else{
        // destroy the bait plant image in cloudinary
        await cloudinary.uploader.destroy(bait.cloudinary_id);
        //upload a new image to cloudinary
        console.log(req.file);
        const result=await cloudinary.uploader.upload(req.file.path);
        //update all the other fields and the image field
        req.body.photos=result.secure_url;
        req.body.cloudinary_id=result.public_id;
        console.log(result);
        newBait = await BaitSchema.findByIdAndUpdate(req.params.id,req.body,{new:true});
        return res.status(200).json({status:true,message:newBait});
       } 
    
    } catch (error) {
        return res.status(500).json({status:false,message:error.message})
    }
}
//delete a bait plant
const delete_bait_plant=async(req,res)=>{
    try {
        //Find user by is
       const user = await BaitSchema.findById(req.params.id);
       //Delete image from cloudinary
       await cloudinary.uploader.destroy(user.cloudinary_id);
       //Delete user from db
       await user.deleteOne({_id:req.params.id});
       return res.status(200).json({status:true,message:"Bait successfully deleted"});
    } catch (error) {
        return res.status(500).json({status:false,message:error.message})
    }
}
//read a single bait plant
const single_bait_plant=async(req,res)=>{
    try {
        //Find Bait by id and return the whole thing
       const bait = await BaitSchema.findById(req.params.id);
       return res.status(200).json({status:true,message:bait});
    } catch (error) {
        return res.status(500).json({status:false,message:error.message})
    }
}
//read all bait plants
const read_bait_plants=async(req,res)=>{
        try {
            console.log(req.file);
           const bait = await BaitSchema.find({})
           return res.status(200).json(bait)
        } catch (error) {
            return res.status(500).json({status:false,message:error.message})
        }
}
module.exports={create_bait_plant,update_bait_plant,delete_bait_plant,single_bait_plant,read_bait_plants}

