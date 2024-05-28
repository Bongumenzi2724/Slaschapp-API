const express=require('express');
const router=express.Router()
const { getAllPastOrders,activateUserProfile,get_user_profile,deleteUserProfile,suspendUserProfile, walletUpdate } = require('../controllers/user_profile');

router.get('/user/history',getAllPastOrders);
router.get('/user/profile',get_user_profile);
router.patch('/user/delete',deleteUserProfile);
router.patch('/user/suspend',suspendUserProfile);
router.patch('/user/wallet',walletUpdate);
router.patch('/user/status/profile',activateUserProfile);

module.exports=router;