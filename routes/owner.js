const express=require('express')
const router=express.Router()
const {getAllBusinessOwners,deleteBusinessOwner,getSingleBusinessOwner,updateBusinessOwnerDetails}=require('../controllers/owner')

//Get all business owners
router.get('/',getAllBusinessOwners)
//get and delete a business owner
router.route('/:id').delete(deleteBusinessOwner).get(getSingleBusinessOwner)
//update business owner details
router.patch('/owner/:id',updateBusinessOwnerDetails)

module.exports=router