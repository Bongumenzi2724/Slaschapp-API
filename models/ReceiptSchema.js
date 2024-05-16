const mongoose=require('mongoose')
const ReceiptSchema=new mongoose.Schema({
    titleOfPurchase:{type:String},
    dateOfTime:{type:Date.now()},
    totalCost:{type:Number},
    item:{type:String},
    quantity:{type:Number},
    price:{type:Number},
    transactionType:{type:String},
    store:{type:String}
},{timestamps:true});
module.exports=mongoose.model('Receipt',ReceiptSchema);