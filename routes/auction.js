const express=require('express')

const router=express.Router()

const {createAuction}=require('../controllers/auction')

router.route('/').post(createAuction)
module.exports=router

