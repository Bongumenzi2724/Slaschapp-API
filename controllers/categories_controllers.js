const { NotFoundError } = require("../errors");
const Categories = require("../models/Categories");
const create_category=async(req,res)=>{
    try{ 
        const categories=new BusinessOwner({
            categoryName:req.body.categoryName,
            categoryImage:req.body.categoryImage,
        });
        categories.save();
    //const categories=await Categories.create({...req.body})
    return res.status(201).json(categories);
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
const update_category=async(req,res)=>{
    let category = await Categories.findById(req.params.id);
    try{
    if(!category){
     throw new NotFoundError(`No Category with id ${req.params.id}`)
    }
    const categoryById=await Categories.findByIdAndUpdate(req.params.id,req.body,{new:true})
    return res.status(200).json(categoryById)
}catch(error){
    return res.status(500).json({status:false,message:error.message});
}
}
const delete_category=async(req,res)=>{
    try {
        //Find user by id
       const category = await Categories.findById(req.params.id);
       if(!category){
        throw new NotFoundError(`No Category with id ${req.params.id}`)
    }
       //Delete image from cloudinary
       //await cloudinary.uploader.destroy(category.cloudinary_id);
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