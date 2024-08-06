const mongoose=require('mongoose')  

const AuctionSchema = new mongoose.Schema({
    campaignName:{
        type:String,
        trim:true,
        required:[true,'Please Provide The Name For Your Campaign']
    },
    campaignDescription:{
        type:String,
        trim:true,
        required:[true,'Please Provide Description For Your Campaign']
    },
    campaignBudget:{
        type:Number,
        trim:true,
        required:[false,'Please Provide Budget For Your Campaign']
    },
    campaignStartDate:{
        type:String,
        trim:true,
        required:[true,"Please Provide The Start Date For Your Campaign"]
    },
    interests:{
        type:String,
        trim:true,
        required:[true,"Please Provide Your Interests"]
    },
    age:{
        type:String,
        trim:true,
        required:[true,"Please Provide Age"]
    },
    location:{
        type:String,
        trim:true,
        required:[false,"Please Provide Location"]
    },
    languages:{
        type:String,
        trim:true,
        required:[true,"Please Provide Languages Used"]
    },
    birthdays:{
        type:String,
        trim:true,
        required:[true,"Please Provide Birthdays"]
    },
    employment:{
        type:String,
        trim:true,
        required:[true,"Please Provide Employment"]
    },
    acquisitionBid:{
        type:Number,
        required:[true,"Please Provide auction bid"]
    },
    gender:{
        type:String,
        trim:true,
        required:[true,"Please Provide Gender"]
    },
    category:{
        type:String,
        trim:true,
        required:[true,"Please Provide Category"]
    },
    status:{
        type:String,
        trim:true,
        required:[true,"Please Provide The Status For Your Campaign"]
    },
    businessId:{
        type:mongoose.Types.ObjectId,
        ref:'Business',
        required:true
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'BusinessOwner',
        required:true
    }
},{timestamps:true})

module.exports=mongoose.model('Auction',AuctionSchema)