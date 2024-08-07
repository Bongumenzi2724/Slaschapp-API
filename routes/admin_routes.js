const express=require('express');

const router=express.Router();

const {AllUsers,AllCarts,getAllCashOutRequests,getAllPastOrders,suspendUserProfile,suspendBusiness,AllBaitPlants,AllBusinessOwners,AllAuctions,AllBusiness,get_all_categories,update_bait_plant,create_category,getUserProfile, suspendAuction,activateOwnerProfile, activateAuction, activateBusiness, activateUserProfile}=require('../controllers/admin_controllers');

const { suspendBusinessOwner } = require('../controllers/owner');

const { admin_get_all_requests, admin_get_status_requests } = require('../controllers/transaction_controller');


router.get('/users',AllUsers)
router.get('/baits',AllBaitPlants)
router.get('/users/:id',getUserProfile)
router.get('/auctions',AllAuctions)
router.get('/businesses',AllBusiness)
router.get('/owners',AllBusinessOwners)
router.get('/orders',AllCarts)
router.get('/category',get_all_categories)

router.post('/category',create_category)
//update bait plant
router.patch('/bait/:id',update_bait_plant)
//get all past orders
router.get('/orders/:user_id',getAllPastOrders);

//suspend auction
router.patch('/suspend/auction/:auctionId',suspendAuction)
//suspend business
router.patch('/suspend/business/:businessId',suspendBusiness)
//suspend user
router.patch('/suspend/user/:userId',suspendUserProfile)
//suspend business owner
router.patch('/suspend/owner/:ownerId',suspendBusinessOwner)
//activate auction
router.patch('/validate/auction/:auctionId',activateAuction)
//activate business
router.patch('/validate/business/:businessId',activateBusiness)
//activate user
router.patch('/validate/user/:userId',activateUserProfile)
//activate owner
router.patch('/validate/owner/:owner_id',activateOwnerProfile)

//admin cash out request routes
router.patch('/owner/cash-out/request/:request_id',admin_get_status_requests);

//get all cash out requests
router.get('/owner/cash-out/requests',admin_get_all_requests);

//get all cash out requests
router.get('/cash-out/requests',getAllCashOutRequests)

module.exports=router