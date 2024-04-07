const express=require('express')
const router=express.Router()

const {registerUser,loginUser,registerBusinessOwner,loginBusinessOwner}=require('../controllers/authentication')
router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/register/BusinessOwner',registerBusinessOwner);
router.post('/login/BusinessOwner',loginBusinessOwner);

module.exports=router