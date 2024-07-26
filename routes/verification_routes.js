const express=require('express');
const {verify_user_otp, verify_owner_otp } = require('../controllers/optController');
const { auctionVerification } = require('../controllers/verification');
const router=express.Router()

// user verification
router.patch('/user/verify-otp',verify_user_otp);

//owner verification
router.patch('/owner/verify-otp',verify_owner_otp);

//verify the if the auction exist and it belong to the business owner
router.post('/auction/checkout',auctionVerification);

module.exports=router;