const express=require('express')
const router=express.Router()

const {createBusiness,deleteBusiness,suspendBusiness,getAllBusinesses,updateBusinessDetails,getSingleBusiness, updateBusinessStatus}=require('../controllers/business')
const {create_bait_plant,update_bait_plant,single_bait_plant,read_bait_plants,delete_bait_plant}=require('../controllers/bait_plant_controllers');
const { createAuction,updateAuctionStatus,getAllBusinessesAunctions,suspendAuction,deleteSingleAuction,getAllAuctionMaterial,getAllAuctions, auctionSearchResults, updateAuctions, getSingleAuction, auctionBusiness} = require('../controllers/auction')
//create the business
router.post('/',createBusiness)
//get all businesses
router.get('/',getAllBusinesses)
//get and delete a single business
router.route('/:id').get(getSingleBusiness);
router.patch('/:id',deleteBusiness);
router.patch('/:id',updateBusinessDetails);
router.patch('/:id',suspendBusiness);
router.patch('/status/:id',updateBusinessStatus);
//auctions routes
router.route('/:businessId/auction').post(createAuction).get(getAllAuctions)
router.route('/:businessId/auction/:auctionId').patch(updateAuctions).get(getSingleAuction)
router.patch('/:businessId/auction/:auctionId',deleteSingleAuction)
router.patch('/:businessId/auction/status/:auctionId',updateAuctionStatus)
router.get('/:businessId/auction',getAllBusinessesAunctions)
router.patch('/:businessId/auction/:auctionId',suspendAuction)
//search the auction results
router.route('/:businessId/search/auction').get(auctionSearchResults)
//Get all auction material available
router.route('/all').get(getAllAuctionMaterial)
router.route('/:businessId/auctions').post(auctionBusiness)

//bait plant routes
router.post('/auction/:auctionID/bait/create',create_bait_plant);
router.get('/auction/:auctionID/bait/:baitID',single_bait_plant)
router.get('/auction/:auctionID/bait/all',read_bait_plants);
router.delete('/auction/:auctionID/bait/:baitID',delete_bait_plant);
router.patch('/auction/:auctionID/bait/:baitID',update_bait_plant);

module.exports=router