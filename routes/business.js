const express=require('express')
const router=express.Router()

const {createBusiness,deleteBusiness,getAllBusinesses,updateBusinessDetails,getSingleBusiness}=require('../controllers/business')

const { createAuction,deleteSingleAuction,getAllAuctionMaterial,getAllAuctions, auctionSearchResults, updateAuctions, getSingleAuction} = require('../controllers/auction')
//create the business
router.post('/',createBusiness)
//get all businesses
router.get('/',getAllBusinesses)
//get and delete a single business
router.route('/:id').get(getSingleBusiness).delete(deleteBusiness)
router.patch('/:id',updateBusinessDetails)
//manage the auction
router.route('/:id/auction').post(createAuction).get(getAllAuctions)
router.route('/:id/auction/:auctionId').patch(updateAuctions).get(getSingleAuction).delete(deleteSingleAuction)
//search the auction results
router.route('/:id/search/auction').get(auctionSearchResults)
//Get all auction material available
router.route('/all').get(getAllAuctionMaterial)
//business analytics routes

module.exports=router