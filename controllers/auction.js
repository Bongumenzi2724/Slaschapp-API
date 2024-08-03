const Auction=require('../models/AuctionSchema');
const Bait = require('../models/BaitSchema');
const User=require('../models/UserRegistrationSchema');
const Cart = require("../models/Cart");
const {NotFoundError}=require('../errors');
const {StatusCodes}=require('http-status-codes');
const { default: mongoose } = require('mongoose');
const BusinessRegistrationSchema = require('../models/BusinessRegistrationSchema');
const Subscription=require('../models/SubscriptionSchema');
const sendEmail = require('../utils/sendEmail');
const generateOTP = require('../utils/generateOtp');

//create auction
const createAuction=async(req,res)=>{
    try {
        req.body.businessId=req.params.businessId;
        req.body.createdBy=req.user.userId;
        //check if there is an existing subscription
        const subscription=await Subscription.findOne({createdBy:req.body.createdBy});
        if(subscription!==null && (subscription.subscriptionStatus).toLowerCase()==='inactive'){
            return res.status(409).json({message:"Outstanding subscription,please pay your subscription"});
        }
        if(req.body.campaignName==false||req.body.campaignBudget==false||req.body.campaignDailyBudget==false||req.body.campaignDescription==false||req.body.campaignStartDate==false||req.body.interests==false||req.body.age==false||req.body.gender==false||req.body.location==false||req.body.birthdays==false||req.body.languages==false){
        
            return res.status(StatusCodes.EXPECTATION_FAILED).json({message:"Please Provide All The Fields"})
        } 
        else{
            const Business=await BusinessRegistrationSchema.findById({_id:req.params.businessId});
            if(!Business){
                return res.status(404).json({message:"Business Not Found"});
            }
            
            const newAuction=await Auction.create({...req.body});
            
            const ownerOtp=generateOTP();

            await sendEmail(Business.email,ownerOtp);
            
            return res.status(StatusCodes.CREATED).json({newAuction});
    } 
    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({message:error.message});
    }
}

//update auction
const updateAuctions=async(req,res)=>{
    try {
        req.body.createdBy=req.user.userId;
        const subscription=await Subscription.findOne({createdBy:req.body.createdBy});
        if(subscription.subscriptionStatus.toLowerCase()==='inactive'){
            return res.status(409).json({message:"Outstanding subscription,please pay your subscription"});
        }
        const{body:{campaignBudget,campaignDailyBudget,status},params:{auctionId:auctionId,businessId:businessId}}=req
        if(campaignBudget==""||campaignDailyBudget==""||campaignStartDate==""||status==""||age==""||location==""||languages==""){

            throw new BadRequestError("Fields cannot be empty please fill everything")
            }
        const auctionData=await Auction.findOneAndUpdate({_id:auctionId},req.body,{new:true,runValidators:true})
        if(!auctionData){
            throw new NotFoundError(`No Auction with id ${auctionId}`)
        }
        res.status(StatusCodes.OK).json({auctionData}) 
    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({message:error.message});
    }
}

// Get all auctions who are 'active' 
const getAllAuctions=async(req,res)=>{
    try {
        const businessId=req.params.businessId;
         
        const auctionData=await Auction.find({
            $and:[
                {businessId:businessId},
                {status:{$in:["Active"]}}
            ]
        });
       return res.status(StatusCodes.OK).json({auctionData,count:auctionData.length});
    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({message:error.message});
    }
}

//Get single auction
const getSingleAuction=async(req,res)=>{
    try {
            
    const auctionData= await Auction.findOne({_id:req.params.auctionId})

    if(!auctionData){
        throw new NotFoundError(`No auction with id ${req.params.auctionId}`)
    }
    
    return res.status(StatusCodes.OK).json({auctionData})
    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({message:error.message});
    }
}

//Get auction
const deleteSingleAuction=async(req,res)=>{

    try{
    const auction= await Auction.findOne({_id:req.params.auctionId});
    if(!auction){
        throw new NotFoundError(`No Auction with id ${req.params.auctionId}`)
    }
    //update the auction status
    auction.status='Revoked';
    let newAuction=auction;
    await Auction.findByIdAndUpdate({_id:req.params.auctionId},{$set:newAuction},{new:true});
    await newAuction.save();
    //find baits related to the auction
    const auctionID=(auction._id).toString();
    const baits=await Bait.aggregate([{$match:{auctionID:new mongoose.Types.ObjectId(auctionID)}}]);
    if(baits.length!==0){

        //delete all the baits
        for(let i=0;i<=baits.length-1;i++){
            let newBaitId=(baits[i]._id).toString();
            baits[i].status="Revoked";
            let newBait=baits[i];
            await Bait.findByIdAndUpdate(newBaitId,{$set:newBait},{new:true});
        }
        //call all the carts associated with baits
        const carts=await Cart.aggregate([{$match:{auctionID:new mongoose.Types.ObjectId(auctionID)}}]);
        if(carts.length!==0){
            //delete all the related carts
            for(let k=0;k<=carts.length-1;k++){
                let newCartId=(carts[k]._id).toString();
                carts[k].status="Revoked";
                let newCart=carts[k];
                await Cart.findByIdAndUpdate(newCartId,{$set:newCart},{new:true});
            }
            return res.status(200).json({message:"Auction,Baits And Carts Deleted Successfully"})
        }
        else{
            return res.status(200).json({message:"Auction and Baits Deleted Successfully"})
        }

    }
    else{

        res.status(StatusCodes.OK).json({message:"Auctions Deleted Successfully"})
    }
    //find cart related to the baits

    }catch(error){
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:false,message:error.message});
    }
}

//Suspend the account 
const suspendAuction=async(req,res)=>{
    try{
    const auction= await Auction.findById({_id:req.params.auctionId});

    if(!auction){
        throw new NotFoundError(`No Auction with id ${req.params.auctionId}`)
    }
    //update the auction status
    auction.status='Suspended';
    let newAuction=auction;
    await Auction.findByIdAndUpdate(req.params.id,{$set:newAuction},{new:true});
    await newAuction.save();
    res.status(StatusCodes.OK).json({message:"This Auction Has Been Suspended"});
}catch(error){
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status:false,message:error.message});
}
}

const getAllAuctionMaterial=async(req,res)=>{
    try {
        const auctionData=await Auction.find({businessId:req.params.businessId}).sort('createdAt');
        return res.status(StatusCodes.OK).json({auctionData,count:auctionData.length});
    } catch (error) {
        return res.status(StatusCodes.NOT_FOUND).json({message:error.message});
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

const auctionSearchResults=async(req,res)=>{
    const{query:{campaignName:campaignName,campaignBudget}}=req
    if(campaignName||campaignBudget){
        const auctionData=await Auction.aggregate([
            {
                $match:{
                    campaignName:new RegExp(campaignName,"i"),
                    campaignBudget:new RegExp(campaignBudget,"i")
                }
            }
        ])
        res.status(StatusCodes.OK).json(auctionData)
    } 
}

/* const getAllBusinessesAunctions=async(req,res)=>{
    //use business id to search all auctions created by a business owner
    try {
        const auctionBusiness=await Auction.findById({_id:req.params.auctionId,businessId:req.params.businessId})
        if(!auctionBusiness){
            return res.status(StatusCodes.NOT_FOUND).json({message:"No Businesses Found"})
        }
        return res.status(StatusCodes.OK).json({auctionBusiness:auctionBusiness});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"An error occurred while fetching your businesses",error:error.message})
    }
} */

const auctionBusiness=async(req,res)=>{
    return res.status(StatusCodes.OK).json({message:"auction"})
}

module.exports={createAuction,activateAuction,auctionBusiness,suspendAuction,getSingleAuction,getAllAuctionMaterial,deleteSingleAuction,auctionSearchResults,getAllAuctions,updateAuctions}