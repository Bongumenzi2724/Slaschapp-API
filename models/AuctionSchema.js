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
        type:Number,
        required:[true,'Please Provide Budget For Your Campaign']
    },
    campaignDailyBudget:{
        type:Number,
        required:[true,'Please Provide The Campaign Daily Budget']
    },
    campaignStartDate:{
        type:String,
        required:[true,"Please Provide The Start Date For Your Campaign"],
        maxlength:100,
        minlength:1,
    },
    interests:{
        type:String,
        //enum:['Music','Entertainment','Sports','Gaming','Fashion And Beauty','Food And Drinks','Business And Finance','Travel And Tourism','Technology And Service','Fashion And Jewellery','Outdoors','Fitness','Home Design'],
        default:'Entertainment'
    },
    status:{
        type:String,
        enum:['Active','Pending','Suspended','Revoked'],
        default:'Pending'
    },
    /* businessId:{
        type:mongoose.Types.ObjectId,
        ref:'Business',
        required:[true,'Please provide the business']
    }, */
    businessId:{
        type:mongoose.Types.ObjectId,
        ref:'Business',
        required:[true,'Please provide the business']
    }
},{timestamps:true})
module.exports=mongoose.model('Auction',AuctionSchema)