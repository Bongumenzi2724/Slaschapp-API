const express=require('express');
const { send_otp, verify_otp } = require('../controllers/optController');
const router=express.Router()

// user verification
router.post('/user/send-otp',send_otp)
router.post('/user/verify-otp',verify_otp)

//owner verification


module.exports=router;