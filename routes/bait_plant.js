const express=require('express')
const router=express.Router()
const {create_bait_plant,update_bait_plant,single_bait_plant,read_bait_plants,delete_bait_plant}=require('../controllers/bait_plant_controllers');
router.post('/create',create_bait_plant);
router.get('/single/:id',single_bait_plant)
router.get('/all',read_bait_plants);
router.delete('/delete/:id',delete_bait_plant);
router.patch('/update/:id',update_bait_plant);

module.exports=router