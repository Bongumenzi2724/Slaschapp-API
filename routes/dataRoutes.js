const express=require('express')
const router=express.Router()
const {Start,Stop}=require('../controllers/dataCollection');

router.post('/collection/start',Start)
router.post('/collection/stop',Stop);

module.exports=router