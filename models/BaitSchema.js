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
price:{
    type:Number,
    required:[true,"Please Provide The Price For The Bait Plant"]
},
color:{
    type:String,
    required:[false,'Please Provide The Color For Your Bait Plant If Present']
},
status:{
    type:String,
    required:[true,"Please Provide The Bait Status"]
},
size:{
    type:String,
    required:[false,'Please Provide The Size For Your Bait Plant'],
    maxlength:100,
    minlength:1
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