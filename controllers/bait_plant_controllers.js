const BaitSchema = require('../models/BaitSchema');
const {StatusCodes}=require('http-status-codes')
//create a bait plant
const create_bait_plant=async(req,res)=>{
    try{ 
        req.body.createdBy=req.params.auctionID;
        const baitPlant=await BaitSchema.create({...req.body})
        return res.status(StatusCodes.CREATED).json(baitPlant);
        }
    catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).status({status:false,message:error.message});
    }
}
//Update a bait plant
const update_bait_plant=async(req,res)=>{
        //Find bait by id in the database
       try{
        let dummyArray=req.body.photos
        const bait = await BaitSchema.findById(req.params.baitID);
        if(!bait){
        throw new NotFoundError(`No bait with id ${req.params.baitID}`);
       }
         if(req.body.photos!==0){
        for(let i=0;i<=dummyArray.length-1;i++){
            bait.photos.push(dummyArray[i]);
        } 
       }
       bait.save();
       req.body.photos=bait.photos;
      newBait = await BaitSchema.findByIdAndUpdate(req.params.baitID,req.body,{new:true});
      return res.status(StatusCodes.ACCEPTED).json({status:true,message:newBait})
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:false,message:error.message})
    }
}
//delete a bait plant
const delete_bait_plant=async(req,res)=>{
    try {
       const user = await BaitSchema.findById(req.params.baitID);
       await user.deleteOne({_id:req.params.baitID});
       return res.status(StatusCodes.OK).json({status:true,message:"Bait successfully deleted"});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:false,message:error.message})
    }
}
//read a single bait plant
const single_bait_plant=async(req,res)=>{
    try {
        //Find Bait by id and return the whole thing
       const bait = await BaitSchema.findById(req.params.baitID);
       return res.status(StatusCodes.OK).json({status:true,message:bait});
    } catch (error) {
        return res.status(500).json({status:false,message:error.message})
    }
}
//read all bait plants
const read_bait_plants=async(req,res)=>{
        try {
            console.log(req.file);
           const bait = await BaitSchema.find({})
           return res.status(StatusCodes.OK).json(bait)
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:false,message:error.message})
        }
}
module.exports={create_bait_plant,update_bait_plant,delete_bait_plant,single_bait_plant,read_bait_plants}

