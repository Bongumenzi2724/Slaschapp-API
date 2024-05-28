const express=require('express')
const router=express.Router()
const {registerUser,loginUser,registerBusinessOwner,UserRegistration,loginBusinessOwner}=require('../controllers/authentication');
//const {sendOTP}=require('../controllers/optController');
const {  user_password_reset, user_forgot_password, user_send_otp, user_verify_otp } = require('../controllers/user_password_controller');
const { owner_password_reset, owner_forgot_password, owner_send_otp, owner_verify_otp } = require('../controllers/owner_password_controllers');

//register app user
//router.post('/register/user',registerUser)
router.post('/register/user',user_send_otp,user_verify_otp,UserRegistration)
//login app user
router.post('/login/user',loginUser)

//user forgot password
router.patch('/login/user/forgot',user_forgot_password)
// reset password route
router.patch('/login/user/reset',user_password_reset)

//register business owner
router.post('/register/owner',owner_send_otp,owner_verify_otp,registerBusinessOwner)
//login business owner
router.post('/login/owner',loginBusinessOwner)
//owner forgot and reset password route
router.patch('/login/owner/forgot',owner_forgot_password)
router.patch('/login/owner/reset',owner_password_reset)

module.exports=router