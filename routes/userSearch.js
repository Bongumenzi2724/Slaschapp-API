const express=require('express')
const router=express.Router()
const {searchForUserDetails} =require('../controllers/userSearch')
router.route('/:key').get(searchForUserDetails)
module.exports=router