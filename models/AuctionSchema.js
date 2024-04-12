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
        checkInStoreAvailability:{
            type:String,
            required:[true,'Is the Bait Plant Available'],
            maxlength:100,
            minlength:1
        },
        percentageDiscount:{
            type:String,
            required:[true,'Please Provide Percentage Discount For Your Bait'],
            maxlength:100,
            minlength:1
        },
        price:{
            type:String,
            required:[true,'Please Provide The Price For Your Campaign'],
            maxlength:1000,
            minlength:1
        },
        color:{
            type:String,
            required:[false,'Please Provide The Color For Your Bait Plant If Present'],
            maxlength:1000,
            minlength:1
        },
        size:{
            type:String,
            required:[false,'Please Provide The Size For Your Bait Plant'],
            maxlength:100,
            minlength:1
        },
        photos:{
            type:[String],
            required:[true,'Please Provide Photos For Your Bait Plant'],
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
        ref:'BusinessOwner',
        required:[true,'Please provide the business owner']
    }
},{timestamps:true})
module.exports=mongoose.model('Auction',AuctionSchema)