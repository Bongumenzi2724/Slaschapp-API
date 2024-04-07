const express=require('express')
const router=express.Router()
const {createBusiness,deleteBusiness,getAllBusinesses,updateBusinessDetails,getSingleBusiness,createBusinessOwner,updateBusinessOwnerDetails,deleteBusinessOwner,getSingleBusinessOwner,getAllBusinessOwners}=require('../controllers/business')
const { createAuction, getAllAuctions, auctionSearchResults, updateAuctions, getSingleAuction} = require('../controllers/auction')
//create the business
router.route('/').post(createBusiness).get(getAllBusinesses)
//create business owner
router.route('/businessOwner').post(createBusinessOwner).get(getAllBusinessOwners)
//delete business owner,get single business owner,update business owner
router.route('/businessOwner/:id').patch(updateBusinessOwnerDetails).delete(deleteBusinessOwner).get(getSingleBusinessOwner)
//perform operations on the business
router.route('/:id').get(getSingleBusiness).delete(deleteBusiness).patch(updateBusinessDetails)
//manage the auction
router.route('/:id/auction').post(createAuction).get(getAllAuctions)
router.route('/:id/auction/:auctionId').patch(updateAuctions).get(getSingleAuction)
//search the auction results
router.route('/:id/search/auction').get(auctionSearchResults)


module.exports=router