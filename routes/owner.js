const express=require('express')
const router=express.Router()
const {getAllBusinessOwners,deleteBusinessOwner,getSingleBusinessOwner,updateBusinessOwnerDetails, suspendBusinessOwner, ownerStatus}=require('../controllers/owner')

//Get all business owners
router.get('/',getAllBusinessOwners)
//get and delete a business owner
router.route('/:id').patch(deleteBusinessOwner).get(getSingleBusinessOwner).patch(suspendBusinessOwner)
//update business owner details
router.patch('/owner/:id',updateBusinessOwnerDetails)
//update business owner status
router.patch('/owner/status/:id',ownerStatus)

module.exports=router