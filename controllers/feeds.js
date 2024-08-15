const {NotFoundError} = require('../errors');
const AuctionSchema = require('../models/AuctionSchema');
const Bait = require('../models/BaitSchema');
const BusinessOwnerRegistration = require('../models/BusinessOwnerRegistration');
const Business=require('../models/BusinessRegistrationSchema')
const User=require('../models/UserRegistrationSchema')
const {StatusCodes}=require('http-status-codes')


//common words strings

function hasCommonWord(str1,str2){

    const words1=str1.split(",");
    const words2=str2.split(",");

    for(const word1 of words1){
        for(const word2 of words2){
            if(word1.toLowerCase()===word2.toLowerCase()){
                return true;
            }
        }
    }
    return false;
}

//last two words

function lastTwoWords(str){
    const words=str.split(",");
    const lastTwo=words.slice(-2);
    return lastTwo.map(word=>word.toLowerCase()).join(",");
}

//string compare 
function locationCompare(str1,str2){
    const cleanedStr1=str1.replace(/\s+/g,'').split(",").sort();
    const cleanedStr2=str2.replace(/\s+/g,'').split(",").sort();
    return cleanedStr1.join()===cleanedStr2.join();
}
//compare gender function

function genderCompare(str1,str2){
    return str1.toLowerCase()===str2.toLowerCase();
}
//get single user

const getUserProfile=async(req,res)=>{
    
    const user= await User.findOne({_id:req.params.id});

    if(!user){
        throw new NotFoundError(`No user profile with id ${req.params.id} exist`)
    }
    return res.status(StatusCodes.OK).json({user})
};

//only active users
const getAllUsersProfiles=async(req,res)=>{
    //const AllUsers=await User.find({}).sort('createdAt')
    const AllUsers=await User.aggregate([{$project:{password:0,resetToken:0,resetTokenExpiration:0,__v:0,wallet:0,AcceptTermsAndConditions:0}}])
    return res.status(StatusCodes.OK).json({AllUsers,count:AllUsers.length});
};

//get all auctions feed
const getAllAuctions=async(req,res)=>{
    //i. Filter all auctions based on the aucquisition bid
    //ii.The highest acquisition bid is placed highest on the user feed

    const AllAuctions=await AuctionSchema.aggregate([{$sort:{acquisitionBid:-1}},{$match:{status:"Active"}},{$project:{updatedAt:0}}]);
    //const AllAuction=await AuctionSchema.aggregate([{$project:{updatedAt:0,createdAt:0,__v:0}},{$match:{status:"Active"}}]);
    //find the user
    const user=await User.findById({_id:req.user.userId});
    
    if(!user){
        return res.status(404).json({message:"User does not exist"});
    }
    let marketing_auctions=[];
    //user location
    const user_location=lastTwoWords(user.locationOrAddress);
    const userGender=(user.gender).toLowerCase()

    console.log(`user gender:${userGender}`);

    const userInterests=user.interests;
    for(let i=0;i<=AllAuctions.length-1;i++){
        
        let locationMatch=false;
        let genderMatch=false;

        if(AllAuctions[i].location!=="All"){
            
            if(AllAuctions[i].location==="All"){
                locationMatch=true;
            }
            else{
            //split the auction location to semi-colon instead of a comma
            let newLocation=(AllAuctions[i].location).split(";");
            //loop through an array that of any length of newLocation and find a single that matches the user location
            for(let j=0;j<=newLocation.length-1;j++){

                console.log(`user location:${user_location},auction location:${newLocation[j]},location name:${AllAuctions[i].campaignName}`)

                if(locationCompare(user_location,(newLocation[j]).toLowerCase())){
                    locationMatch=true;
                }
            }
            console.log(`user location:${user_location},auction location:${newLocation},location name:${AllAuctions[i].campaignName}`)
        }
            //locationMatch=locationCompare(user_location,(AllAuctions[i].location).toLowerCase());
            console.log(`location match : ${locationMatch}`);
        }
        if(AllAuctions[i].location=="All" || locationMatch){

            if(AllAuctions[i].gender!=="all"){
                console.log(`auction gender:${AllAuctions[i].gender},user gender:${userGender}`)
                let gender=(AllAuctions[i].gender).toLowerCase();

                if(AllAuctions[i].gender==="all"){
                    genderMatch=true;
                }else{
                    genderMatch=genderCompare(gender,userGender);
                }
                console.log(`gender match:${genderMatch}`)
            }
            
            if(AllAuctions[i].gender==='all'|| genderMatch){

                if(AllAuctions[i].gender=="all"){
                    genderMatch=true
                }
                console.log(`auction gender:${AllAuctions[i].gender},user gender:${userGender},gender match:${genderMatch}`)
                console.log(`interests1:${hasCommonWord(AllAuctions[i].interests,userInterests)}`)
                
                if(hasCommonWord(AllAuctions[i].interests,userInterests)){
                    console.log(`interests:${hasCommonWord(AllAuctions[i].interests,userInterests)}`)
                    marketing_auctions.push(AllAuctions[i]);
                }else{
                    continue;
                }
            }else{
                continue
            }
        }
        else{
            continue;
        }
         
    }
    return res.status(StatusCodes.OK).json({auctionFeed:marketing_auctions,count:marketing_auctions.length});
};

//only active owners feed
const AllOwnersProfiles=async(req,res)=>{
    //const AllUsers=await User.find({}).sort('createdAt')
    const AllUsers=await BusinessOwnerRegistration.aggregate([{$project:{password:0,resetToken:0,resetTokenExpiration:0,__v:0,wallet:0,AcceptTermsAndConditions:0}}])
    return res.status(StatusCodes.OK).json({AllUsers,count:AllUsers.length});
};

const getAllBaits=async(req,res)=>{
    const baitsFeed=await Bait.find({});
    return res.status(StatusCodes.OK).json({baitsFeed,count:baitsFeed.length});
}

const getAllBaitsForUsers=async(req,res)=>{

    const baitsFeed=await Bait.find({auctionID:req.params.auctionID});
    return res.status(StatusCodes.OK).json({baitsFeed,count:baitsFeed.length});
}

//Get all active businesses 
const activeBusinessFeeds=async(req,res)=>{

     const activeBusinesses=await Business.aggregate([{$match:{status:'Active'}}]);
    if(!activeBusinesses){
        return res.status(StatusCodes.NOT_FOUND).json({message:"Businesses Not Found"});
    }
    return res.status(StatusCodes.OK).json({businesses:activeBusinesses});
}
module.exports={getUserProfile,getAllBaitsForUsers,activeBusinessFeeds,AllOwnersProfiles,getAllAuctions,getAllBaits,getAllUsersProfiles}