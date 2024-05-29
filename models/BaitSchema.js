const mongoose=require('mongoose')  
const BaitSchema = new mongoose.Schema({

baitPlantName:{
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
    type:Number
},
color:{
    type:String,
    required:[false,'Please Provide The Color For Your Bait Plant If Present']
},
status:{
    type:String
},
size:{
    type:String,
    required:[false,'Please Provide The Size For Your Bait Plant'],
    maxlength:100,
    minlength:1
},
photos:{
    type:Array
},
createdBy:{
    type:mongoose.Types.ObjectId,
    ref:'Auction'
},
auctionID:{
    type:mongoose.Types.ObjectId,
    ref:'Auction',
    required:[true,'Please provide the business owner']
} 
},{timestamps:true});

module.exports=mongoose.model('Bait',BaitSchema)