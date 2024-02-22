const express=require('express')
const router=express.Router()
const {createBusiness,deleteBusiness,getAllBusinesses,updateBusinessDetails,getSingleBusiness}=require('../controllers/business')
const {createAuction, auctionSearchResults} = require('../controllers/auction')
router.route('/').post(createBusiness).get(getAllBusinesses)
router.route('/:id').get(getSingleBusiness).delete(deleteBusiness).patch(updateBusinessDetails)
router.route('/auction').post(createAuction).get(auctionSearchResults)
//router.route('/search').get(searchForBusinessDetails)
module.exports=router