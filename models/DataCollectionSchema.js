const DataCollectionSchema = new mongoose.Schema({
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,'Please provide the business owner']
    },
    pageID:{
        type:String,
        required:[true,'Please Provide the pageID'],
        maxlength:100,
        minlength:1
    },
    startTime:{
        type:String,
        required:[true,'Please Provide the start time'],
        maxlength:100,
        minlength:1
    },
    EndTime:{
        type:String,
        required:[true,"Please Provide the end time"],
        unique:true,
        minlength:2,

    }
})
module.exports=mongoose.model('DataCollection',DataCollectionSchema)