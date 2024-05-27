const express=require('express');
const router=express.Router()
const { getAllPastOrders,get_user_profile,deleteUserProfile,suspendUserProfile, } = require('../controllers/user_profile');

router.get('/user/history',getAllPastOrders);
router.get('/user/profile',get_user_profile);
router.patch('/user/delete',deleteUserProfile);
router.patch('/user/suspend',suspendUserProfile);
module.exports=router;