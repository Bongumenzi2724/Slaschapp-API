const express=require('express');
const router=express.Router();

const { user_forgot_password, user_password_reset } = require('../controllers/user_password_controller');
const { owner_forgot_password, owner_password_reset } = require('../controllers/owner_password_controllers');

router.patch('/user/forgot_password',user_forgot_password);

router.patch('/user/password_reset',user_password_reset);

router.patch('/owner/forgot_password',owner_forgot_password);

router.patch('/owner/password_reset',owner_password_reset);

module.exports=router