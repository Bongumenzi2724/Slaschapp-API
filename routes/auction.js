const express=require('express')
const router=express.Router()
const {createAuction,updateAuctions,getAllAuctions,auctionSearchResults} = require('../controllers/auction')

router.route('/').post(createAuction).get(getAllAuctions)
router.route('/:id').patch(updateAuctions)
router.route('/search').get(auctionSearchResults)

module.exports=router