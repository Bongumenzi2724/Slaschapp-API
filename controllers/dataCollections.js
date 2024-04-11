const { StatusCodes } = require("http-status-codes")
const Business=require('../models/BusinessRegistrationSchema')
const DataCollection=require('../models/DataCollectionSchema')
const {BadRequestError,NotFoundError}=require('../errors')

const createData=async(req,res)=>{
    req.body.createdBy=req.user.userId
    const dataCollected = await DataCollection.create(req.body);
    return res.status(StatusCodes.CREATED).json({dataCollected});
}
const getAllData =async(req,res) =>{
    const dataCollected=await DataCollection.find({createdBy:req.user.userId}).sort('createdAt')
    return res.status(StatusCodes.OK).json({dataCollected,count:dataCollected.length})
}
module.exports={createData,getAllData}