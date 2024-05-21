const express=require('express')
const router=express.Router()
const {registerUser,loginUser,registerBusinessOwner,UserRegistration,loginBusinessOwner}=require('../controllers/authentication');
//const {sendOTP}=require('../controllers/optController');
const { forgotPassword, passwordReset } = require('../controllers/password_controller');

//register app user
//router.post('/register/user',registerUser)
router.post('/register/user',UserRegistration)
//login app user
router.post('/login/user',loginUser)
//user forgot password
router.patch('/login/user/forgot',forgotPassword)
// reset password route
router.patch('/login/user/reset/:resetToken',passwordReset)

//register business owner
router.post('/register/owner',registerBusinessOwner)
//login business owner
router.post('/login/owner',loginBusinessOwner)
//owner forgot and reset password route
router.patch('/login/owner/forgot',forgotPassword)
router.patch('/login/owner/reset/:resetToken',passwordReset)

module.exports=router