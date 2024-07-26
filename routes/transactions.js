const express=require('express')
const { create_bank_account,get_all_owner_accounts,create_cash_out_requests, change_cash_request_status,get_all_requests } = require('../controllers/transaction_controller')
const { userWalletUpdate } = require('../controllers/user_profile')
const router=express.Router()
//create account for owner
router.post('/create/account/:owner_id',create_bank_account)
//get all owner accounts
router.get('/accounts/:owner_id',get_all_owner_accounts)
//create cash outs
router.post('/account/:account_id/create/request/:owner_id',create_cash_out_requests);
//get all requests
router.get('/owner/requests/:owner_id',get_all_requests);
//change cash request status
router.patch('/owner/request/status/:request_id',change_cash_request_status)
module.exports=router
