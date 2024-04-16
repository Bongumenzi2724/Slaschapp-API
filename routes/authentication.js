const express=require('express')
const router=express.Router()

const {registerUser,loginUser,registerBusinessOwner,loginBusinessOwner}=require('../controllers/authentication');

const {sendOTP}=require('../controllers/optController');
const { forgotPassword, passwordReset } = require('../controllers/password_controller');

//register app user
router.post('/register/user',sendOTP,registerUser)
//login app user
router.post('/login/user',loginUser)
//user forgot and reset password route
router.post('/login/user/forgot',forgotPassword)
router.post('/login/user/reset',passwordReset)
//register business owner
router.post('/register/owner',registerBusinessOwner)
//login business owner
router.post('/login/owner',loginBusinessOwner)
//owner forgot and reset password route
router.post('/login/owner/forgot',forgotPassword)
router.post('/login/owner/reset',passwordReset)

module.exports=router