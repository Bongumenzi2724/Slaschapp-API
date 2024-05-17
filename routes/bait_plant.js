const express=require('express')
const router=express.Router()
const {create_bait_plant,update_bait_plant,single_bait_plant,read_bait_plants,delete_bait_plant}=require('../controllers/bait_plant_controllers');
router.post('/auction/:auctionID/bait/create',create_bait_plant);
router.get('/auction/:auctionID/bait/:baitID',single_bait_plant)
router.get('/auction/:auctionID/bait',read_bait_plants);
router.delete('/auction/:auctionID/bait/:baitID',delete_bait_plant);
router.patch('/auction/:auctionID/bait/:baitID',update_bait_plant);

module.exports=router