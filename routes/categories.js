const express=require('express')
const router=express.Router()
const upload=require('../utils/multer');
const {create_category,get_category,get_all_categories,delete_category,update_category}=require('../controllers/categories_controllers')
router.post('/',upload.single('image'),create_category);
router.get('/single/:id',get_category)
router.get('/all',get_all_categories);
router.delete('/delete/:id',delete_category);
router.patch('/update/:id',upload.single('image'),update_category);

module.exports=router