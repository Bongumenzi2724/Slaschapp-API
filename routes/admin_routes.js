const express=require('express')
const router=express.Router()
const {AllUsers,AllBusinessOwners,AllAuctions,AllBusiness,get_all_categories,update_bait_plant,deleteUserProfile,create_category,getUserProfile, read_bait_plants}=require('../controllers/admin_controllers');
const paginated = require('../middleware/pagination');
router.get('/users',paginated,AllUsers)
router.get('/users/:id',getUserProfile)
router.get('/auctions',paginated,AllAuctions)
router.get('/businesses',paginated,AllBusiness)
router.get('/owners',paginated,AllBusinessOwners)
router.get('/category',paginated,get_all_categories)
router.post('/category',create_category)
router.patch('/bait/:id',update_bait_plant)
router.delete('/user/:id',deleteUserProfile)
router.get('/baits',read_bait_plants)

module.exports=router