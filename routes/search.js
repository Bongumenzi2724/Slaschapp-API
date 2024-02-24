const express=require('express');
const router=express.Router();

const {searchBusiness}=require('../controllers/business')

router.route('/').get(searchBusiness)

module.exports=router