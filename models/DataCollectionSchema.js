const mongoose=require('mongoose')
const DataCollectionSchema = new mongoose.Schema({
    createdBy:{
        type:String,
        required:[true,'Please provide the business owner'],
        maxlength:1000,
        minlength:1
    },
    pageID:{
        type:String,
        required:[false,'Please Provide the pageID'],
        maxlength:100,
        minlength:1
    },
    key:{
        type:String,
        required:[false,'Please Provide the Key'],
        maxlength:100,
        minlength:1
    },
    startTime:{
        type:String,
        required:[false,'Please Provide the start time'],
        maxlength:100,
        minlength:1
    },
    EndTime:{
        type:String,
        required:[false,"Please Provide the end time"],
        unique:true,
        minlength:2,

    }
},{timestamps:true})
module.exports=mongoose.model('DataCollection',DataCollectionSchema)