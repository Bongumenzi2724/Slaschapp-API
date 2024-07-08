const mongoose=require('mongoose')  
const AuctionSchema = new mongoose.Schema({
    campaignName:{
        type:String,
        required:[true,'Please Provide The Name For Your Campaign']
    },
    campaignDescription:{
        type:String,
        required:[true,'Please Provide Description For Your Campaign']
    },
    campaignBudget:{
        type:Number,
        required:[true,'Please Provide Budget For Your Campaign']
    },
    campaignDailyBudget:{
        type:Number,
        required:[true,'Please Provide The Campaign Daily Budget']
    },
    campaignStartDate:{
        type:String,
        required:[true,"Please Provide The Start Date For Your Campaign"]
    },
    interests:{
        type:String,
        required:[true,"Please Provide Your Interests"]
    },
    age:{
        type:String,
        required:[true,"Please Provide Age"]
    },
    location:{
        type:String,
        required:[true,"Please Provide Location"]
    },
    languages:{
        type:String,
        required:[true,"Please Provide Languages Used"]
    },
    birthdays:{
        type:String,
        required:[true,"Please Provide Birthdays"]
    },
    employment:{
        type:String,
        required:[true,"Please Provide Employment"]
    },
    acquisitionBid:{
        type:String,
        required:[true,"Please Provide auction bid"]
    },
    status:{
        type:String,
        required:[true,"Please Provide The Status For Your Campaign"]
    },
    businessId:{
        type:mongoose.Types.ObjectId,
        ref:'Business',
        required:[true,'Please provide the business']
    }
},{timestamps:true})
module.exports=mongoose.model('Auction',AuctionSchema)