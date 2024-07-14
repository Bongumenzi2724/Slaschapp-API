const router=require('express').Router()

const { payment_controller } = require("../controllers/payment_controller");

router.patch('/payment/cart/:cart_id',payment_controller);

module.exports=router