const express=require('express')
const router=express.Router()
const { create_subscription,cancel_subscription,pay_subscription } = require("../controllers/subscription")

router.post('/owner_subscription',create_subscription);
router.patch('/owner_subscription/:owner_id',cancel_subscription);
router.patch('/pay/owner_subscription/:subscription_id',pay_subscription)
module.exports=router;