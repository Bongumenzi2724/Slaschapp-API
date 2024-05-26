const express=require('express')
const router=express.Router()

const{getAllAuctions,getAllBaits,AllOwnersProfiles,getAllUsersProfiles}=require('../controllers/feeds')
//router.get('/single/:id',getUserProfile)
router.get('/all/users',getAllUsersProfiles);
router.get('/all/owners',AllOwnersProfiles);
router.get('/all/auctions',getAllAuctions);
router.get('/all/baits',getAllBaits);
//router.delete('/delete/:id',deleteUserProfile);
//router.patch('/update/:id',updateUserProfile);

module.exports=router