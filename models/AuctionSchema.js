const mongoose=require('mongoose')

const AuctionSchema = new mongoose.Schema({

    itemName:{
        type:String,
        required:[true,'Please Provide The Name Of Your Item'],
        maxlength:100,
        minlength:1
    },
    itemImage:{
        type:String,
        required:[false,'Please Provide The Image Of Your Item'],
        maxlength:100,
        minlength:1
    },
    itemPrice:{
        type:String,
        required:[true,'Please Provide The Price of Your Item'],
        maxlength:7,
        minlength:1
    },
    soldBy:{
        type:String,
        required:[true,'Please Provide Your the Name of the store that sells the item'],
        maxlength:100,
        minlength:1
    },
    description:{
        type:String,
        required:[true,"Please Provide The Description of Your Item"],
        maxlength:100,
        unique:true,
        minlength:2,
    },
    checkInStoreAvailability:{
        type:String,
        required:[true,"Is the Item Available in store"],
        maxlength:5,
        minlength:2,
    },
    PercentageDiscount:{
        type:String,
        required:[true,"Please Provide The Percentage Discount"],
        maxlength:5,
        minlength:1,
    },

     buyItem:{
        type:String,
        required:[true,"Buy the available item in store"],
        maxlength:10,
        minlength:1,
    }, 
   
})

module.exports=mongoose.model('Auction',AuctionSchema)