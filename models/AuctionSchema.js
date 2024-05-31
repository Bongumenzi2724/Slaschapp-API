const mongoose=require('mongoose')  
const AuctionSchema = new mongoose.Schema({
    
    campaignName:{
        type:String,
        required:[true,'Please Provide The Name For Your Campaign']
    },
    campaignDescription:{
        type:String,
        required:[false,'Please Provide Description For Your Campaign']
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
        type:String
    },
    age:{
        type:String
    },
    location:{
        type:String
    },
    languages:{
        type:String
    },
    birthdays:{
        type:String
    },
    status:{
        type:String
    },
    businessId:{
        type:mongoose.Types.ObjectId,
        ref:'Business',
        required:[true,'Please provide the business']
    }
},{timestamps:true})
module.exports=mongoose.model('Auction',AuctionSchema)