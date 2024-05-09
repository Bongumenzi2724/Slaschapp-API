const express=require('express')
const router=express.Router()
const {create_category,get_category,get_all_categories,delete_category,update_category}=require('../controllers/categories_controllers');
router.post('/',create_category);
router.get('/single/:id',get_category)
router.get('/all',get_all_categories);
router.delete('/delete/:id',delete_category);
router.patch('/update/:id',update_category);

module.exports=router