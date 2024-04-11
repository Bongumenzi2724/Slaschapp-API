const express=require('express');

const {sendOTP,verifyOTP}=require('../controllers/optController');

const router=express.Router();

router.get('/sendOTP',sendOTP);
router.get('/verifyOTP',verifyOTP);

module.exports=router;