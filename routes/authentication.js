const express=require('express')
const router=express.Router()

const {registerUser,loginUser,registerBusinessOwner,loginBusinessOwner}=require('../controllers/authentication')

//register app user
router.post('/register/user',registerUser);
//login app user
router.post('/login/user',loginUser);
//register business owner
router.post('/register/owner',registerBusinessOwner);
//login business owner
router.post('/login/owner',loginBusinessOwner);

module.exports=router