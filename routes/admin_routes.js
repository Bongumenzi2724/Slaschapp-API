const express=require('express')
const router=express.Router()
const {AllUsers,AllCarts,getAllPastOrders,suspendUserProfile,suspendBusiness,AllBaitPlants,AllBusinessOwners,AllAuctions,AllBusiness,get_all_categories,update_bait_plant,create_category,getUserProfile, suspendAuction, activateAuction, activateBusiness, activateUserProfile}=require('../controllers/admin_controllers');
const paginated = require('../middleware/pagination');
router.get('/users',AllUsers)
router.get('/baits',AllBaitPlants)
router.get('/users/:id',getUserProfile)
router.get('/auctions',AllAuctions)
router.get('/businesses',AllBusiness)
router.get('/owners',AllBusinessOwners)
router.get('/orders',AllCarts)
router.get('/category',get_all_categories)
router.post('/category',create_category)
router.patch('/bait/:id',update_bait_plant)

//suspend auction
router.patch('/suspend/auction/:auctionId',suspendAuction)
//suspend business
router.patch('/suspend/business/:businessId',suspendBusiness)
//suspend user
router.patch('/suspend/user/:userId',suspendUserProfile)

//activate auction
router.patch('/activate/auction/:auctionId',activateAuction)
//activate business
router.patch('/activate/business/:businessId',activateBusiness)
//activate user
router.patch('/activate/user/:userId',activateUserProfile)



module.exports=router