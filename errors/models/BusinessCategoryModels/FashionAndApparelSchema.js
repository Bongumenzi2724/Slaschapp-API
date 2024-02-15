const mongoose=require('mongoose')
const FashionAndApparelSchema = new mongoose.Schema({

        /* type:String,
        required:[true,'Please Provide The Fashion And Apparel Field'],
        maxlength:100,
        minlength:1 */
        itemName:{
            type:String,
            required:[true,'Please Provide the Name of the item'],
            maxlength:200,
            minlength:1,
        },
        itemImage:{
            type:String,
            required:[true,'Please Provide an Image'],
            maxlength:10000,
            minlength:1,
        },
        itemPrice:{
            type:String,
            required:[true,'Please Provide The Price Item'],
            maxlength:10000,
            minlength:1,
        },
        RewardForBait:{
            type:String,
            required:[true,'Please Provide The Reward For Bait'],
            maxlength:10000,
            minlength:1,
        },
        itemSizeOptions:{
            type:String,
            required:[true,'Please Size Of Items'],
            enum:['XS','S','M','L','XL','XXL','XXXL'],
            maxlength:4,
            minlength:1,
            
        },
        soldBy:{
            type:String,
            required:[true,'Please enter the name of the store'],
            maxlength:20,
            minlength:2
        },
        description:{
            type:String,
            required:[true,'Please Provide a description of the item'],
            maxlength:250,
            minlength:2
        },
        availability:{
            type:String,
            required:[true,'Please check if the item is available'],
            maxlength:10,
            minlength:2
        },
        percentageDiscount:{
            type:String,
            required:[true,'Please check if the percentage discount'],
            maxlength:4,
            minlength:1 
        },
       /*  buy:{

        } */
})

module.exports=mongoose.model('FashionAndApparel',FashionAndApparelSchema)