const express=require('express');

const { OwnerWalletUpdate, completed_cart_under_auction } = require('../controllers/owner');

const router=express.Router()

router.patch('/wallet',OwnerWalletUpdate);

router.get('/cart/:auctionId',completed_cart_under_auction);

module.exports=router;