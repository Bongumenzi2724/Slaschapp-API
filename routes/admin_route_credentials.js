const express=require('express');

const router=express.Router();

const { loginAdmin,registerAdmin } = require('../controllers/authentication');

router.post('/login',loginAdmin);

router.post('/register',registerAdmin);
module.exports=router