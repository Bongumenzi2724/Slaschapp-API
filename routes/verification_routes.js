const express=require('express');
const {verify_otp } = require('../controllers/optController');
const { auctionVerification } = require('../controllers/verification');
const router=express.Router()

// user verification
router.post('/user/verify-otp',verify_otp);
//owner verification
router.post('/owner/verify-otp',verify_otp);
//verify the if the auction exist and it belong to the business owner
router.get('/auction/checkout',auctionVerification);

module.exports=router;