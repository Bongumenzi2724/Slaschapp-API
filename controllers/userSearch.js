const { StatusCodes } = require("http-status-codes")
const User=require('../models/UserRegistrationSchema')
const {NotFoundError}=require('../errors')

const searchForUserDetails=async(req,res)=>{
    console.log(req.params.key);
    req.body.createdBy=req.user.userId
    const userData = await User.find(
        {
            "$or":[
                {firstname:{$regex:req.params.key}},
                {locationOrAddress:{$regex:req.params.key}},
                {educationStatus:{$regex:req.params.key}},
                {employmentStatus:{$regex:req.params.key}},
                {gender:{$regex:req.params.key}},
                {interests:{$regex:req.params.key}},
            ]
        }
    )
    if(!businessData){
        throw new NotFoundError("No Business Data Exist With That Format")
    }
    res.status(StatusCodes.OK).json(userData)
}

module.exports={searchForUserDetails}