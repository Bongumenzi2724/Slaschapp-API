const express=require('express')
const router=express.Router()
const {searchForUserDetails} =require('../controllers/businessSearch')
router.route('/:key').get(searchForUserDetails)
module.exports=router