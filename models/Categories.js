const mongoose=require('mongoose') 
const CategoriesSchema=new mongoose.Schema({
    categoryName:{
        type:String,
        required:[true,'Please Provide The Category'],
        maxlength:200,
        minlength:1,
    },
    categoryImage:{
        type:String
    }
},{timestamps:true})
module.exports=mongoose.model('Categories',CategoriesSchema)