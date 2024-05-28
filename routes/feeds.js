const express=require('express')
const router=express.Router()

const{getAllAuctions,activeBusinessFeeds,getAllBaits,AllOwnersProfiles,getAllUsersProfiles}=require('../controllers/feeds')

router.get('/all/users',getAllUsersProfiles);
router.get('/all/owners',AllOwnersProfiles);
router.get('/all/auctions',getAllAuctions);
router.get('/all/baits',getAllBaits);
router.get('/active/businesses',activeBusinessFeeds);

module.exports=router