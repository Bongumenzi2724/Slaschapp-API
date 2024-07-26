const mongoose=require('mongoose')  

const SubscriptionSchema=new mongoose.Schema({

    subscriptionFee:{
        type:Number,
        default:79.99
    },
    subscriptionStatus:{
        type:String,
        default:'active'
    },
    subscriptionDate:{
        type:Date
    },
    nextBillingDate:{
        type:Date
    },
    paymentStatus:{
        type:String,
        default:'unpaid'
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'BusinessOwner',
        required:true
    },
    freeTrial:{
        type:Boolean,
        default:true
    }

},{timestamps:true});

module.exports=mongoose.model('Subscription', SubscriptionSchema)