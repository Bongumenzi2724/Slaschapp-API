const express=require('express')

const router=express.Router()

const {createBusiness,deleteBusiness,getAllBusinesses,updateBusinessDetails,getSingleBusiness}=require('../controllers/business')

router.route('/').post(createBusiness).get(getAllBusinesses)
router.route('/:id').get(getSingleBusiness).delete(deleteBusiness).patch(updateBusinessDetails)

module.exports=router