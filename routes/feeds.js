const express=require('express')
const router=express.Router()

const{getAllAuctions,activeBusinessFeeds,getAllBaits,AllOwnersProfiles,getAllUsersProfiles, getAllBaitsForUsers}=require('../controllers/feeds')

router.get('/all/users',getAllUsersProfiles);
router.get('/all/owners',AllOwnersProfiles);
router.get('/all/auctions',getAllAuctions);
router.get('/all/baits',getAllBaits);
router.get('/active/businesses',activeBusinessFeeds);
router.get('/auctions/baits/:auctionID',getAllBaitsForUsers);

module.exports=router