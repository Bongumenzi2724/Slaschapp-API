const BusinessCategorySchema = new mongoose.Schema({
    FashionAndApparel:{
        itemName:{
            type:String,
            required:[true,'Please Provide the Name of the item'],
            maxlength:200,
            minlength:1,
        },
    },
    FoodAndDrinks:{
        type:String,
        required:[false,'Please Provide The Food And Drinks Field'],
        maxlength:100,
        minlength:1
    },
    BeautyAndCosmetics:{
        type:String,
        required:[true,'Please Provide Baeuty And Cosmetics Field'],
        maxlength:100,
        minlength:1
    },
    TechAndElectronics:{
        type:String,
        required:[true,'Please Provide Your Surname'],
        maxlength:100,
        minlength:1
    },
    Sneakers:{
        type:String,
        required:[true,"Please Provide Your Password"],
        unique:true,
        minlength:2,

    },
    Home:{
        type:String,
        required:[true,"Please Provide Your Password"],
        unique:true,
        minlength:2,

    },
    Jewellery:{
        type:String,
        required:[true,"Please Provide Your Password"],
        unique:true,
        minlength:2,

    },
})
module.exports=mongoose.model('CategorySchema',BusinessCategorySchema)