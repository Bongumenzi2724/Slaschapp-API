const express=require('express');
const {verify_otp } = require('../controllers/optController');
const router=express.Router()

// user verification
router.post('/user/verify-otp',verify_otp);
//owner verification
router.post('/owner/verify-otp',verify_otp);

module.exports=router;