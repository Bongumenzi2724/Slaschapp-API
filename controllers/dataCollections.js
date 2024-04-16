const { StatusCodes } = require("http-status-codes")
const DataCollection=require('../models/DataCollectionSchema')
const Stop=require('../models/DataCollectionStop')

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

const StartCollect=async(req,res)=>{
    const {pageID,key,userID}=req.body;
    startTime=Date.now()
    const dataCollected=await DataCollection.create({pageID:pageID,createdBy:userID,key:key,startTime:startTime});
    return res.status(StatusCodes.OK).json(dataCollected);
}

const StopCollect=async(req,res)=>{
    const {entryID}=req.body;
    stopTime=Date.now()
    await DataCollection.findOneAndUpdate({createdBy:entryID},{EndTime:stopTime});
    return res.status(StatusCodes.OK).json({message:"success"});
}
module.exports={createData,getAllData,StartCollect,StopCollect}