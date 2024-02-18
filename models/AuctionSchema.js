const mongoose=require('mongoose')
  
const AuctionSchema = new mongoose.Schema({

    campaignName:{
        type:String,
        required:[true,'Please Provide The Name Of Your Campaign'],
        maxlength:100,
        minlength:1
    },
    campaignDescription:{
        type:String,
        required:[false,'Please Provide The Description of Your Campaign'],
        maxlength:200,
        minlength:1
    },
    campaignBudget:{
        type:String,
        required:[true,'Please Provide The Campaign Budget'],
        maxlength:100,
        minlength:1
    },
    campaignDailyBudget:{
        type:String,
        required:[true,'Please Provide The Campaign Budget'],
        maxlength:100,
        minlength:1
    },
    campaignStartDate:{
        type:String,
        required:[true,'Please Provide The Start Date For Your Campaign'],
        maxlength:100,
        minlength:1
    },
    checkInStoreAvailability:{
        type:String,
        required:[true,"Is the Item Available in store"],
        maxlength:100,
        minlength:2,
    },
    percentageDiscount:{
        type:String,
        required:[true,"Please Provide The Percentage Discount"],
        maxlength:100,
        minlength:1,
    },

     commitmentFee:{
        type:String,
        required:[true,"Please Provide The Campaign Commitment Fee"],
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
            required:[true,"Please Provide The Name Bait Plant"],
            maxlength:100,
            minlength:1,
        },
        descriptionBaitPlant:{
            type:String,
            required:[true,"Please Provide The Description Of The Bait Plant"],
            maxlength:100,
            minlength:1,
        },
        price:{
            type:String,
            required:[true,"Please Provide The Price Of the Bait Plant"],
            maxlength:10,
            minlength:1,
        },
        photos:{
            type:String,
            required:[true,"Please Provide The Bait Plant Photo"],
            maxlength:100,
            minlength:1,
        }
    }, 
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,'Please provide the user']
    } 
})

module.exports=mongoose.model('Auction',AuctionSchema)