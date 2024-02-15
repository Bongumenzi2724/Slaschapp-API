const express=require('express')

const router=express.Router()

const {createUserInterests,deleteUserInterests,getUserAllInterests,UpdateUserInterests}=require('../controllers/userInterests')


router.post('/createUserInterests',createUserInterests);
router.delete('/deleteUserInterests/:id',deleteUserInterests).patch('/updateUserInterest/:id',UpdateUserInterests)
router.get('/getAllUserInterest',getUserAllInterests)


module.exports=router