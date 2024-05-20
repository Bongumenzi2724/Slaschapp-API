const mongoose=require('mongoose') 
const CartSchema=new mongoose.Schema({
    userID:{
        type:String
    },
    baitID:{
        /* type:mongoose.Schema.Types.ObjectId,
        ref:'Bait',
        required:true */
        type:String,
    },
    totalPrice:{
       type:Number,
       required:true
    },
    quantity:{
        type:Number
    }
},{timestamps:true})
module.exports=mongoose.model('Cart',CartSchema)