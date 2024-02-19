const { StatusCodes } = require("http-status-codes")
const Business=require('../models/BusinessRegistrationSchema')
const {NotFoundError}=require('../errors')

const searchForBusinessDetails=async(req,res)=>{
    console.log(req.params.key);
    req.body.createdBy=req.user.userId
    const businessData = await Business.find(
        {
            "$or":[
                {BusinessName:{$regex:req.params.key}},
                {BusinessCategory:{$regex:req.params.key}},
                {BusinessLocation:{$regex:req.params.key}},
            ]
        }
    )
    if(!businessData){
        throw new NotFoundError("No Business Data Exist With That Format")
    }
    res.status(StatusCodes.OK).json(businessData)
}

module.exports={searchForBusinessDetails}