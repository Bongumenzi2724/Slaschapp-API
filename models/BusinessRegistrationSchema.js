const mongoose=require('mongoose')

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
        minlength:1
    },
    BusinessEmail:{
        type:String,
        required:[true,'Please Provide Your Business Email Address'],
        unique:true,
        minlength:2
    },
    AcceptTermsAndConditions:{
        type:String,
        required:[true,'Please Accept Terms And Conditions'],
        maxlength:4,
        minlength:1
    },
    VerificationCode:{
        type:String,
        required:[true,'Please Provide The Verification Code'],
        maxlength:5,
        minlength:1
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
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,'Please provide the user']
    }
},{timestamps:true})

module.exports=mongoose.model('Business',BusinessRegistrationSchema)