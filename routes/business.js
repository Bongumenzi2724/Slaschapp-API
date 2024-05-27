const express=require('express')
const router=express.Router()

const {createBusiness,deleteBusiness,getAllBusinesses,updateBusinessDetails,getSingleBusiness}=require('../controllers/business')
const {create_bait_plant,update_bait_plant,single_bait_plant,read_bait_plants,delete_bait_plant}=require('../controllers/bait_plant_controllers');
const { createAuction,deleteSingleAuction,getAllAuctionMaterial,getAllAuctions, auctionSearchResults, updateAuctions, getSingleAuction} = require('../controllers/auction')
//create the business
router.post('/',createBusiness)
//get all businesses
router.get('/',getAllBusinesses)
//get and delete a single business
router.route('/:id').get(getSingleBusiness).delete(deleteBusiness)
router.patch('/:id',updateBusinessDetails)

//auctions routes
router.route('/:id/auction').post(createAuction).get(getAllAuctions)
router.route('/:id/auction/:auctionId').patch(updateAuctions).get(getSingleAuction)
router.patch('/:id/auction/:auctionId',deleteSingleAuction)
//search the auction results
router.route('/:id/search/auction').get(auctionSearchResults)
//Get all auction material available
router.route('/all').get(getAllAuctionMaterial)

//bait plant routes
router.post('/auction/:auctionID/bait/create',create_bait_plant);
router.get('/auction/:auctionID/bait/:baitID',single_bait_plant)
router.get('/auction/:auctionID/bait/all',read_bait_plants);
router.delete('/auction/:auctionID/bait/:baitID',delete_bait_plant);
router.patch('/auction/:auctionID/bait/:baitID',update_bait_plant);

module.exports=router