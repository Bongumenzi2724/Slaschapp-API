const express=require('express')
const { add_bank_account,transfer_funds } = require('../controllers/transaction_controller')
const router=express.Router()

router.post('/account',add_bank_account)
router.post('/transfer',transfer_funds)

module.exports=router
