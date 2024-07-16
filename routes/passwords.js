const express=require('express');
const router=express.Router();

const { user_forgot_password, user_password_reset } = require('../controllers/user_password_controller');

router.patch('/user/forgot_password',user_forgot_password);

router.patch('/user/password_reset',user_password_reset);

module.exports=router