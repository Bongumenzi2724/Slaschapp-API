const { NotFoundError } = require("../errors");
const cloudinary=require('../utils/cloudinary');
const Categories = require("../models/Categories");

const create_category=async(req,res)=>{
    try{ 
        const result=await cloudinary.uploader.upload(req.file.path);
        req.body.categoryImage=result.secure_url;
        req.body.cloudinary_id=result.public_id; 
        const categories=await Categories.create({...req.body})
        res.status(StatusCodes.CREATED).json({id:categories._id,categoryName:categories.categoryName,categoryImage:categories.categoryImage});
    }catch(error){
        return res.status(500).status({status:false,message:error.message})
    }
}
const get_category=async(req,res)=>{
    try {
       const category = await Categories.findById(req.params.id);
       if(!category){
        throw new NotFoundError(`No Category with id ${req.params.id}`)
    }
       return res.status(200).json({status:true,category:category});
    } catch (error) {
        return res.status(500).json({status:false,message:error.message})
    }
}
const update_category=async(req,res)=>{}
const delete_category=async(req,res)=>{
    try {
        //Find user by id
       const category = await Categories.findById(req.params.id);
       if(!category){
        throw new NotFoundError(`No Category with id ${req.params.id}`)
    }
       //Delete image from cloudinary
       await cloudinary.uploader.destroy(category.cloudinary_id);
       //Delete user from db
       await category.deleteOne({_id:req.params.id});
       return res.status(200).json({status:true,message:"Category Successfully deleted"});
    } catch (error) {
        return res.status(500).json({status:false,message:error.message})
    }
}
const get_all_categories=async(req,res)=>{
    try {
       const categories = await Categories.find({})
       return res.status(200).json(categories)
    } catch (error) {
        return res.status(500).json({status:false,message:error.message})
    }
}

module.exports={create_category,get_category,update_category,delete_category,get_all_categories}