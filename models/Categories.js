const mongoose=require('mongoose') 
const CategoriesSchema=new mongoose.Schema({
    categoryName:{
        type:String,
        required:[true,'Please Provide the Name of the item'],
        maxlength:200,
        minlength:1,
    },
    categoryImage:{
        type:String
    },
    cloudinary_id:{
        type:String
    }
},{timestamps:true})
module.exports=mongoose.model('Categories',CategoriesSchema)