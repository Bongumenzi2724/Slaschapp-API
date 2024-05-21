const mongoose=require('mongoose') 
const CartSchema=new mongoose.Schema({
    userId:{
        type:String
    },
    totalPrice:{
       type:Number,
       required:true
    },
    quantity:{
        type:Number
    },
    items:{
        type:Array
    },
    status:{
        type:String
    },
    code:{
        type:String
    }
},{timestamps:true})
module.exports=mongoose.model('Cart',CartSchema)