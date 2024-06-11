const express=require('express');

const {send_otp,verify_otp}=require('../controllers/optController');

const router=express.Router();

router.post('/sendOTP',send_otp);
router.post('/user/verify',verify_otp);

module.exports=router;