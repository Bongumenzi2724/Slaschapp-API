const express=require('express')
const router=express.Router()
const { StartCollect,StopCollect} = require('../controllers/dataCollections')

router.post('/collection/start',StartCollect)
router.post('/collection/stop',StopCollect);

module.exports=router