const mongoose=require('mongoose');
const BusinessRegistrationSchema = new mongoose.Schema({
    
    BusinessName:{
        type:String,
        required:[true,'Please Provide Your Business Name']
    },
    PhoneNumber:{
        type:String,
        required:[false,'Please Provide Your Business Phone Number'],
        unique:false

    },
    BusinessEmail:{
        type:String,
        required:[true,'Please Provide Your Business Email Address']
    },
    AcceptTermsAndConditions:{
        type:String,
        required:[true,'Please Accept Terms And Conditions']
    },
    BusinessCategory:{
        type:String,
        required:[true,"Please Provide Your Business Category"]
    },
    BusinessLocation:{
        type:String,
        required:[true,'Please Provide Your Business location']
    },
    BusinessHours:{
        type:String,
        required:[true,'Please Provide Your Business Working Hours']
    },
    BusinessLogo:{
        type:String
    },
    BusinessBio:{
        type:String
    },
    BusinessType:{
        type:String
    },
    verificationDoc:{
        type:String
    },
    socials:{
        type:String,
        required:[false,'Please Provide Your Socials']
    },
    status:{
        type:String
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'BusinessOwner',
        required:[true,'Please provide the business owner']
    }
},{timestamps:true})

module.exports=mongoose.model('Business',BusinessRegistrationSchema)