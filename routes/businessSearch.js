const express=require('express')
const router=express.Router()
const {searchForBusinessDetails} =require('../controllers/businessSearch')
router.route('/:key').get(searchForBusinessDetails)
module.exports=router