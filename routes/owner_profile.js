const express=require('express');

const { OwnerWalletUpdate } = require('../controllers/owner');

const router=express.Router()

router.patch('/wallet',OwnerWalletUpdate);

module.exports=router;