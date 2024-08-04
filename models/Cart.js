const mongoose=require('mongoose') 

const CartSchema=new mongoose.Schema({
   
    userId:{
        type:mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    auctionName:{
        type:String
    },

    auctionId:{
        type:String,
        required:[true,"Please Provide The AuctionID"]
    },

    totalCartPrice:{
       type:Number
    },

    totalCartQuantity:{
        type:Number
    },

    baits:[{
        baitId:{type: mongoose.Schema.Types.ObjectId, ref: 'Bait' },
        baitName:String,
        quantity:Number,
        price:Number,
        size:String,
        color:String
    }],
    status:{
        type:String
    },
    code:{
        type:String
    },
    paymentMethod:{
        type:String
    },
    cartOTP:{
        type:String,
        required:false
    },
    expiryDate:{
        type:Date
    }
},{timestamps:true});

module.exports=mongoose.model('Cart',CartSchema)