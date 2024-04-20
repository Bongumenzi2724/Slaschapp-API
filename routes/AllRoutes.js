const express=require('express')
const router=express.Router()


const {AllUsers,AllBusinessOwners,AllAuctions,AllBusiness}=require('../controllers/allControllers');

router.get('/users',AllUsers)
router.get('/auctions',AllAuctions)
router.get('/businesses',AllBusiness)
router.get('/owners',AllBusinessOwners)

module.exports=router