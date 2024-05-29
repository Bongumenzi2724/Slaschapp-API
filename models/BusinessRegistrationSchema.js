const mongoose=require('mongoose');
const BusinessRegistrationSchema = new mongoose.Schema({
    
    BusinessName:{
        type:String,
        required:[true,'Please Provide Your Business Name'],
        maxlength:100,
        minlength:1
    },
    PhoneNumber:{
        type:String,
        required:[false,'Please Provide Your Business Phone Number'],
        maxlength:100,
        unique:false,
        minlength:1
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
        required:[true,"Please Provide Your Business Category"],
        enum:['Fashion And Apparel','Food And Drinks','Beauty And Cosmetics','Tech And Electronics','Sneakers','Home','Jewellery'],
        default:'Fashion & Apparel'
    },
    BusinessLocation:{
        type:String,
        required:[true,'Please Provide Your Business location'],
        maxlength:100,
        minlength:1
    },
    BusinessHours:{
        type:String,
        required:[true,'Please Provide Your Business Working Hours'],
        maxlength:100,
        minlength:1
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
        type:String,
        enum:['Active','Pending','Suspended','Revoked']
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'BusinessOwner',
        required:[true,'Please provide the business owner']
    }
},{timestamps:true})

module.exports=mongoose.model('Business',BusinessRegistrationSchema)