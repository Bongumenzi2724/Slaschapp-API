const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')

const AuctionSchema = new mongoose.Schema({

    Music:{
        type:String,
        required:[true,'Please Provide Your Favorite Genre of Music'],
        maxlength:100,
        minlength:1
    },
    Entertainment:{
        type:String,
        required:[false,'Please Provide Your Form of Entertainment'],
        maxlength:100,
        minlength:1
    },
    Sports:{
        type:String,
        required:[true,'Please Provide Your Favorite Sport'],
        maxlength:100,
        minlength:1
    },
    Gaming:{
        type:String,
        required:[true,'Please Provide Your Gaming Of Choice'],
        maxlength:100,
        minlength:1
    },
    FashionAndBeauty:{
        type:String,
        required:[true,"Please Provide Your Fashion and Beauty Preference"],
        maxlength:100,
        unique:true,
        minlength:2,
    },
    FoodAndDrinks:{
        type:String,
        required:[true,"Please Provide Your Food and Drinks Preferences"],
        maxlength:100,
        unique:true,
        minlength:2,
    },
    BusinessAndFinance:{
        type:String,
        required:[true,"Please Provide Your Business and Finance  Preferences"],
        maxlength:100,
        unique:true,
        minlength:2,
    },

     TravelAndTourism:{
        type:String,
        required:[true,"Please Provide Travel and Tourism  Preferences"],
        maxlength:100,
        unique:true,
        minlength:2,
    },
    TechnologyAndScience:{
        type:String,
        required:[true,"Please Provide Your Technology and Science Preferences"],
        maxlength:100,
        unique:true,
        minlength:2,
    },
    FashionAndJewellery:{
        type:String,
        required:[true,"Please Provide Your Fashion and Jewellery  Preferences"],
        maxlength:100,
        unique:true,
        minlength:2,
    },
    Outdoors:{
        type:String,
        required:[true,"Please Provide Your Outdoors Preferences"],
        maxlength:100,
        unique:true,
        minlength:2,
    },
    Fitness:{
        type:String,
        required:[true,"Please Provide Your Fitness Preferences"],
        maxlength:100,
        unique:true,
        minlength:2,
    },
    HomeDesign:{
        type:String,
        required:[true,"Please Provide Your Home Design Preferences"],
        maxlength:100,
        unique:true,
        minlength:2,
    },
})

module.exports=mongoose.model('Auction',AuctionSchema)