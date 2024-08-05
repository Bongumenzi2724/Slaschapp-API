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
    const set2=new Set(words2.map(word=>word.trim().toLowerCase()));

    for(const word of words1){
        if(set2.has(word.trim().toLowerCase())){
            return true;
        }
        return false;
    }
}

//last two words

function lastTwoWords(str){
    const words=str.split(",");
    const lastTwo=words.slice(-2);
    return lastTwo.map(word=>word.toLowerCase()).join(",");
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

    console.log(`user location:${user_location}`);

    const userGender=(user.gender).toLowerCase()
    const userInterests=user.interests;
   for(let j=0;j<AllAuctions.length-1;j++){
        //determining when do i slice the location string

       /*  if(!(AllAuctions[j].location=="All")){

            auctionLocation=(AllAuctions[j].location.split(",").slice(-2).join(',')).toLowerCase();

        }  */
        //comapre the equality of the two strings
        //auction location filter
        
        let match=false

        if(AllAuctions[j].location=="All"){

            match=true;
        }
        else{
            match=user_location == (AllAuctions[j].location).toLowerCase();
        }
        console.log(`user location:${user_location}, auction location :${(AllAuctions[j].location).toLowerCase()}, match: ${match}`);

        if(match){
            //check the gender
            let genderMatch=false;

            if(AllAuctions[j].gender=="all"){

                genderMatch=true;
            }else{
                genderMatch= userGender==(AllAuctions[j].gender).toLowerCase();
            }

            //genderMatch=userGender==(AllAuctions[j].gender).toLowerCase() || AllAuctions[j].gender=="all";

            console.log(`use gender :${userGender}, auction gender :${AllAuctions[j].gender} gender match: ${genderMatch}`);

            if(genderMatch){
                //check the interests
                console.log(genderMatch);
                //check the auction interests
                //const auctionInterests=AllAuctions[j].interests.match(/([^,]+)/g);
                //const auctionsInterests=(AllAuctions[j].interests).split(",");
                //check the user interests
                //const userInterests=user.interests.match(/([^,]+)/g);
                //const usersInterests=(user.interests).split(",");
                const hasMatch=hasCommonWord(userInterests,AllAuctions[j].interests);

                //console.log(hasMatch);
                if(hasMatch || AllAuctions[j].interests=="All"){
                    //console.log(AllAuctions[j]);
                    console.log(`Interests: ${hasMatch}`);
                    //push the auction into the array
                    marketing_auctions.push(AllAuctions[j]);
                    //console.log(marketing_auctions);
                }
            }
        }
    }   
    //sort in terms of the acquisitionBid
    console.log(marketing_auctions);

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