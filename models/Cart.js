const mongoose=require('mongoose') 
const CartSchema=new mongoose.Schema({
    //"user id"
    userId:{
        type:mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    auctionName:{
        type:String
    },
    auctionId:{
        type:String
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
        //enum:["In-Progress","Pending","Complete","Canceled","Expired"]
    },
    code:{
        type:String
    },
    paymentMethod:{
        type:String
    },
    expiryDate:{
        type:Date
    }
},{timestamps:true})
module.exports=mongoose.model('Cart',CartSchema)