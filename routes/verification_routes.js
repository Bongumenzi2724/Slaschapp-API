const express=require('express');
const { user_send_otp, user_verify_Otp } = require('../controllers/user_password_controller');
const { owner_send_otp, owner_verify_otp } = require('../controllers/owner_password_controllers');
const router=express.Router()

// user verification
router.post('/user/send-otp',user_send_otp)
router.post('/user/verify-otp',user_verify_Otp)

//owner verification
router.post('/owner/verify-otp',owner_verify_otp)
router.post('/owner/send-otp',owner_send_otp)



module.exports=router;