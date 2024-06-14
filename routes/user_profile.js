const express=require('express');
const router=express.Router()
const { getAllPastOrders,updateUserProfile,activateUserProfile,get_user_profile,deleteUserProfile,suspendUserProfile, walletUpdate } = require('../controllers/user_profile');

router.get('/user/history',getAllPastOrders);

router.get('/user/:id',get_user_profile);
router.patch('/user/delete/:id',deleteUserProfile);
router.patch('/user/suspend/:id',suspendUserProfile);
router.patch('/user/wallet',walletUpdate);
router.patch('/user/update/:id',updateUserProfile)
router.patch('/user/status/profile',activateUserProfile);

module.exports=router;