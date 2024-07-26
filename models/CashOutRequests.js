const mongoose=require('mongoose');

const CashOutRequestSchema=new mongoose.Schema({

    Account_ID:{
        type:mongoose.Types.ObjectId,
        ref:'Accounts'
    },
    Amount:{
        type:Number
    },
    Status:{
        type:String
    },
    Owner:{
        type:mongoose.Types.ObjectId,
        ref:'BusinessOwner'
    }
},{timestamps:true});

module.exports=mongoose.model('Cash_Out',CashOutRequestSchema)