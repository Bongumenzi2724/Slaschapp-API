const BaitSchema = require('../models/BaitSchema');
const Bait = require('../models/BaitSchema');
const Cart = require("../models/Cart");

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
            auctionID:req.params.auctionID
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
        const bait=await Bait.findById(req.params.baitID);
        if(!bait){
            return res.status(StatusCodes.NOT_FOUND).json({message:"Bait Does Not Exist"})
        }
         const updatedBait=await Bait.findOneAndUpdate({_id:req.params.baitID,auctionId:auctionID},req.body,{new:true,runValidators:true})

         if(!updatedBait){
            return res.status(StatusCodes.NOT_FOUND).json({message:"Bait Could Not Be Updated"})
         }
         return res.status(StatusCodes.OK).json({message:"Bait Updated Successfully",data:updatedBait})

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
       //find carts that contains this bait
       const auctionID=123345;
       const carts=await Cart.aggregate([{$match:{auctionID:new mongoose.Types.ObjectId(auctionID)}}]);

       if(carts.length!==0){
        //delete all the related carts
        for(let k=0;k<=carts.length-1;k++){
            let newCartId=(carts[k]._id).toString();
            carts[k].status="Revoked";
            let newCart=carts[k];
            await Cart.findByIdAndUpdate(newCartId,{$set:newCart},{new:true});
        }
        return res.status(200).json({message:"Bait And Carts Deleted Successfully"})
    }
    else{
        return res.status(200).json({message:"Bait Deleted Successfully"})
    }

    } 
    catch (error) {
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

