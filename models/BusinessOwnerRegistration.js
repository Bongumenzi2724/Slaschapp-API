const mongoose=require('mongoose')
const jwt = require('jsonwebtoken')

const BusinessOwnerRegistrationSchema = new mongoose.Schema({

    firstname:{
        type:String,
        trim:true,
        required:[true,'Please Provide Your First Name']
    },
    secondname:{
        type:String,
        trim:true,
        required:[false,'Please Provide Your Second Name']
    },
    surname:{
        type:String,
        trim:true,
        required:[true,'Please Provide Your Surname']
    },
    profilePicture:{
        type:String
    },
    phoneNumber:{
        type:String,
        required:[true,"Please Provide Your Phone Number"]
    },
    email:{
        type:String,
        required:[true,'Please Provide Your Email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Please Provide Your Password"] 
    },
    AcceptTermsAndConditions:{
        type:String,
        required:[true,'Please Provide Accept Terms And Conditions']
       
    },
    locationOrAddress:{
        type:String,
        trim:true,
        required:[true,'Please Provide Your location or address']
    },
    birthday:{
        type:String,
        trim:true,
        required:[false,'Please Provide Your Birthday in the format (YYYY/MM/DD)']
    },
    IdNumber:{
        type:String,
        required:[true,'Please Provide Your ID Number']
    },
    IdDocumentLink:{
        type:String
    },
    gender:{
        type:String,
        trim:true
    },
    //owner wallet
    wallet:{
        type:Number,
        required:[false,'Wallet Value Required'],
        default:0
    },
     otp:{
        type:Number,
        expires:'5m',
        required:[false,'OTP number Needs to be provided']
    },
    verified:{
        type:Boolean,
        required:[false,'OTP verification confirmation'],
        default:false
    },
    resetToken:{
        type:String,
        required:false,
        default:''
    },
    resetTokenExpiration:{
        type:String,
        required:false,
        default:''
    },
    status:{
        type:String,
        trim:true,
        default:"Active"
    },
    totalAcquisitionBidPaid:{
        type:Number,
        required:false,
        default:0
    }
})

BusinessOwnerRegistrationSchema.pre('save',async function(){
    //const salt = await bcrypt.genSalt(10);
    //this.password = await bcrypt.hash(this.password,salt)

})

BusinessOwnerRegistrationSchema.methods.createJWT=function(){
    return jwt.sign({userId:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}

BusinessOwnerRegistrationSchema.methods.comparePassword=function(candidatePassword,hashedPassword){
    let isMatch=false;
    if(candidatePassword===hashedPassword){
        isMatch=true;
        return isMatch
    }
    else{
        isMatch=false;
        return isMatch
    }
} 

/* BusinessOwnerRegistrationSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword,this.password);
    return isMatch
}  */

BusinessOwnerRegistrationSchema.path('password').unique(false);
BusinessOwnerRegistrationSchema.path('phoneNumber').unique(false);

//BusinessOwnerRegistrationSchema.index({password:1},{unique:false});
//BusinessOwnerRegistrationSchema.index({phoneNumber:1},{unique:false});

module.exports=mongoose.model('BusinessOwner',BusinessOwnerRegistrationSchema)