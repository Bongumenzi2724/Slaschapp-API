const express=require('express')
const router=express.Router()
const {createBusiness,deleteBusiness,getAllBusinesses,updateBusinessDetails,getSingleBusiness}=require('../controllers/business')
const { createAuction, getAllAuctions, auctionSearchResults } = require('../controllers/auction')
router.route('/').post(createBusiness).get(getAllBusinesses)
router.route('/:id').get(getSingleBusiness).delete(deleteBusiness).patch(updateBusinessDetails)
router.route('/:id/auction').post(createAuction).get(getAllAuctions)
router.route('/:id/auction/search').get(auctionSearchResults)
module.exports=router