const express=require('express')
const { add_bank_account,transfer_funds } = require('../controllers/transaction_controller')
const { walletUpdate } = require('../controllers/user_profile')
const router=express.Router()

router.post('/wallet',walletUpdate)
router.post('/transfer',transfer_funds)

module.exports=router
