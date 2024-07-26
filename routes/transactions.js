const express=require('express')
const { add_bank_account,transfer_funds } = require('../controllers/transaction_controller')
const { userWalletUpdate } = require('../controllers/user_profile')
const router=express.Router()

router.post('/wallet',userWalletUpdate)
router.post('/transfer',transfer_funds)

module.exports=router
