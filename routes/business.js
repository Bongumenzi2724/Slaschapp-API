const express=require('express')
const router=express.Router()

const {createBusiness,deleteBusiness,getAllBusinesses,updateBusinessDetails,getSingleBusiness,createBusinessOwner,updateBusinessOwnerDetails,deleteBusinessOwner,getSingleBusinessOwner,getAllBusinessOwners}=require('../controllers/business')

const { createAuction,deleteSingleAuction,getAllAuctionMaterial,getAllAuctions, auctionSearchResults, updateAuctions, getSingleAuction} = require('../controllers/auction')

//create the business
router.route('/').post(createBusiness).get(getAllBusinesses)
//perform operations on the business
router.route('/:id').get(getSingleBusiness).delete(deleteBusiness).patch(updateBusinessDetails)
//create business owner
router.route('/owner').post(createBusinessOwner).get(getAllBusinessOwners)
//router.route('/owner').post(getAllBusinessOwners)
//delete business owner,get single business owner,update business owner
router.route('/owner/:id').patch(updateBusinessOwnerDetails).delete(deleteBusinessOwner).get(getSingleBusinessOwner)

//manage the auction
router.route('/:id/auction').post(createAuction).get(getAllAuctions)
router.route('/:id/auction/:auctionId').patch(updateAuctions).get(getSingleAuction).delete(deleteSingleAuction)
//search the auction results
router.route('/:id/search/auction').get(auctionSearchResults)
//Get all auction material available
router.route('/all').get(getAllAuctionMaterial)
//business analytics routes

module.exports=router