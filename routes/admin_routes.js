const express=require('express')
const router=express.Router()
const {AllUsers,AllCarts,getAllPastOrders,AllBaitPlants,AllBusinessOwners,AllAuctions,AllBusiness,get_all_categories,update_bait_plant,deleteUserProfile,create_category,getUserProfile}=require('../controllers/admin_controllers');
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
//router.delete('/user/:id',deleteUserProfile)

module.exports=router