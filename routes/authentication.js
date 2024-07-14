const express=require('express')
const router=express.Router()
const {loginUser,registerUser,registerBusinessOwner,UserRegistration,loginBusinessOwner}=require('../controllers/authentication');


const { owner_password_reset, owner_forgot_password} = require('../controllers/owner_password_controllers');
const { user_forgot_password, user_password_reset } = require('../controllers/user_password_controller');



//register app user
//router.post('/register/user',registerUser)
router.post('/register/user',registerUser)
//login app user
router.post('/login/user',loginUser)

//user forgot password
router.patch('/login/user/forgot',user_forgot_password)
// reset password route
router.patch('/login/user/reset',user_password_reset)

//verify the 

//send otp

//register business owner
router.post('/register/owner',registerBusinessOwner)
//login business owner
router.post('/login/owner',loginBusinessOwner)
//owner forgot and reset password route
router.patch('/login/owner/forgot',owner_forgot_password)
router.patch('/login/owner/reset',owner_password_reset)

module.exports=router