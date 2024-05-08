const mongoose=require('mongoose')  
const AuctionSchema = new mongoose.Schema({
    
    campaignName:{
        type:String,
        required:[true,'Please Provide The Name For Your Campaign'],
        maxlength:100,
        minlength:1
    },
    campaignDescription:{
        type:String,
        required:[false,'Please Provide Description For Your Campaign'],
        maxlength:1000,
        minlength:1
    },
    campaignBudget:{
        type:String,
        required:[true,'Please Provide Budget For Your Campaign'],
        maxlength:100,
        minlength:1
    },
    campaignDailyBudget:{
        type:String,
        required:[true,'Please Provide Your Email'],
        maxlength:100,
        minlength:1,
    },
    campaignStartDate:{
        type:String,
        required:[true,"Please Provide The Start Date For Your Campaign"],
        maxlength:100,
        minlength:1,
    },
    interests:{
        type:String,
        enum:['Music','Entertainment','Sports','Gaming','Fashion And Beauty','Food And Drinks','Business And Finance','Travel And Tourism','Technology And Service','Fashion And Jewellery','Outdoors','Fitness','Home Design'],
        default:'Entertainment'
    },
    baitPlant:{
        type:mongoose.Types.ObjectId,
        ref:'Bait',
        required:true
    },
    businessId:{
        type:mongoose.Types.ObjectId,
        ref:'Business',
        required:[true,'Please provide the business']
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'BusinessOwner',
        required:[true,'Please provide the business owner']
    }
},{timestamps:true})
module.exports=mongoose.model('Auction',AuctionSchema)