const express=require('express');
const router=express.Router()

const {getAllPastCompletedOrders,getAllPastOrders,updateUserProfile,activateUserProfile,get_user_profile,deleteUserProfile,suspendUserProfile, userWalletUpdate, user_completed_cart, userRewardsUpdate } = require('../controllers/user_profile');

router.get('/user/completed/history',getAllPastCompletedOrders);

router.get('/user/history',getAllPastOrders);

router.get('/user/:id',get_user_profile);

router.get('/user/complete/cart',user_completed_cart);

router.patch('/user/delete/:id',deleteUserProfile);

router.patch('/user/suspend/:id',suspendUserProfile);

router.patch('/user/wallet',userWalletUpdate);

router.patch('/user/rewards',userRewardsUpdate);

router.patch('/user/update/:id',updateUserProfile);

router.patch('/user/status/profile',activateUserProfile);

module.exports=router;