const mongoose=require('mongoose')  
const BaitSchema = new mongoose.Schema({  
baitPlantName:{
    type:String,
    trim:true,
    required:[true,'Please Provide The Name For Your Bait Plant']
},
baitPlantDescription:{
    type:String,
    trim:true,
    required:[true,'Please Provid The Description For Your Bait Plant']
},
checkInStoreAvailability:{
    type:String,
    trim:true,
    required:[true,'Is the Bait Plant Available']
},
price:{
    type:Number,
    required:[true,"Please Provide The Price For The Bait Plant"]
},
color:{
    type:String,
    trim:true,
    required:false
},
status:{
    type:String,
    trim:true,
    required:[true,"Please Provide The Bait Status"]
},
size:{
    type:String,
    trim:true,
    required:[false,'Please Provide The Size For Your Bait Plant']
},
photos:{
    type:Array,
    required:[true,'Please provide at least one photo']

},
auctionID:{
    type:mongoose.Types.ObjectId,
    ref:'Auction',
    required:[true,'Please provide the business owner']
} 
},{timestamps:true});

module.exports=mongoose.model('Bait',BaitSchema)