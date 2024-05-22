const express=require('express')
const { search_controller } = require('../controllers/search_controller')
const router=express.Router()

router.get('/search',search_controller);

module.exports=router