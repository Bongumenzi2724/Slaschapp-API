const express=require('express')
const router=express.Router()
const upload=require('../utils/multer');
const{getUserProfile,deleteUserProfile,getAllUsersProfiles,updateUserProfile}=require('../controllers/user_profile_controllers')
router.get('/single/:id',getUserProfile)
router.get('/all',getAllUsersProfiles);
router.delete('/delete/:id',deleteUserProfile);
router.patch('/update/:id',upload.single('image'),updateUserProfile);

module.exports=router