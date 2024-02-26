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
    checkInStoreAvailability:{
        type:String,
        required:[true,'Is the auction available'],
        maxlength:100,
        minlength:1
    },
    percentageDiscount:{
        type:String,
        required:[true,'Please Provide Percentage Discount For Your Bait'],
        maxlength:100,
        minlength:1
    },
    interests:{
        type:String,
        enum:['Music','Entertainment','Sports','Gaming','Fashion And Beauty','Food And Drinks','Business And Finance','Travel And Tourism','Technology And Service','Fashion And Jewellery','Outdoors','Fitness','Home Design'],
        default:'Entertainment'
    },
    baitPlant:{
        name:{
            type:String,
            required:[true,'Please Provide The Name For Your Bait Plant'],
            maxlength:100,
            minlength:1
        },
        baitPlantDescription:{
            type:String,
            required:[true,'Please Provid The Description For Your Bait Plant'],
            maxlength:1000,
            minlength:1
        },
        price:{
            type:String,
            required:[true,'Please Provide The Price For Your Campaign'],
            maxlength:100,
            minlength:1
        },
        photos:{
            type:String,
            required:[true,'Please Provide The Photo For Your Bait Plant'],
            maxlength:100,
            minlength:1
        },
    },
    businessId:{
        type:mongoose.Types.ObjectId,
        ref:'Business',
        required:[true,'Please provide the business']
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,'Please provide the user']
    }
},{timestamps:true})

module.exports=mongoose.model('Auction',AuctionSchema)