const express=require('express')
const router=express.Router()
const {getAllBusinessOwners,deleteBusinessOwner,getSingleBusinessOwner,updateBusinessOwnerDetails, suspendBusinessOwner, ownerStatus}=require('../controllers/owner')

//Get all business owners
router.get('/owners',getAllBusinessOwners)
//get a single business owner
router.route('/:id').get(getSingleBusinessOwner)
//update business owner details
router.patch('/owner/update/:id',updateBusinessOwnerDetails)
//delete business owner
router.patch('/owner/delete/:id',deleteBusinessOwner)
//suspends business owner
router.patch('/owner/suspend/:id',suspendBusinessOwner)
//update business owner status
router.patch('/owner/status/:id',ownerStatus)

module.exports=router