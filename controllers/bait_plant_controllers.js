const BaitSchema = require('../models/BaitSchema');
const Bait = require('../models/BaitSchema');
const {StatusCodes}=require('http-status-codes');

//create a bait plant
const create_bait_plant=async(req,res)=>{
    try{ 
        req.body.createdBy=req.user.userId;
        if(req.body.baitPlantName==false||req.body.baitPlantDescription==false||req.body.checkInStoreAvailability==false||req.body.price==false||req.body.color==false||req.body.status==false||req.body.size==false||req.body.photos==false){
            return res.status(StatusCodes.EXPECTATION_FAILED).json({message:"Please Provide All The Fields"})
        } 
        let baitPlant=new Bait({
            baitPlantName:req.body.baitPlantName,
            baitPlantDescription:req.body.baitPlantDescription,
            checkInStoreAvailability:req.body.checkInStoreAvailability,
            price:req.body.price,
            color:req.body.color,
            status:req.body.status,
            size:req.body.size,
            photos:req.body.photos,
            auctionID:req.params.auctionID,
            createdBy:req.body.createdBy
        });
        baitPlant.save();
        res.status(StatusCodes.CREATED).json({baitPlant});
        }
    catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).status({status:false,message:error.message});
    }
}

//Update a bait plant
const update_bait_plant=async(req,res)=>{
        //Find bait by id in the database
       try{
        //what to update on the baits??
        //Add or remove bait photos
        //check what's present in the req.body object
        //find the bait using the baitID
        const bait=await Bait.findById(req.body.baitID);
        if(!bait){
            return res.status(StatusCodes.NOT_FOUND).json({message:"Bait Does Not Exist"})
        }
        //check the if there are any photos to add in the req.body object
        
        //what to use to remove a photo the ID or the string url?

        //update the total bait price
         
        return res.status(200).json({message:"Bait Updated"});
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:false,message:error.message})
    }
}

//delete a bait plant
const delete_bait_plant=async(req,res)=>{
    try {
        console.log(req.params)
       const bait = await Bait.findById(req.params.baitID);
       if(!bait){
        return res.status(404).json({message:"The bait does not exist"})
       }
       bait.status='Revoked';
       let newBait=bait;
       await Bait.findByIdAndUpdate(req.params.baitID,{$set:newBait},{new:true});
       await newBait.save();
       return res.status(StatusCodes.OK).json({status:true,message:"Bait Successfully Deleted"});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:false,message:error.message})
    }
}

//read a single bait plant
const single_bait_plant=async(req,res)=>{
    try {
        //Find Bait by id and return the whole thing
       const bait = await Bait.findById(req.params.baitID);
       return res.status(StatusCodes.OK).json({status:true,message:bait});
    } catch (error) {
        return res.status(500).json({status:false,message:error.message})
    }
}

//read all bait plants
const read_bait_plants=async(req,res)=>{
        try {
           const bait = await Bait.find({auctionID:req.params.auctionID,createdBy:req.user.userId})
           return res.status(StatusCodes.OK).json(bait)
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:false,message:error.message})
        }
}

module.exports={create_bait_plant,update_bait_plant,delete_bait_plant,single_bait_plant,read_bait_plants}

