const mongoose=require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const BusinessOwnerRegistrationSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:[true,'Please Provide Your First Name'],
        maxlength:100,
        minlength:1
    },
    secondname:{
        type:String,
        required:[false,'Please Provide Your Second Name'],
        maxlength:100,
        minlength:1
    },
    surname:{
        type:String,
        required:[true,'Please Provide Your Surname'],
        maxlength:100,
        minlength:1
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
    },
    password:{
        type:String,
        required:[true,"Please Provide Your Password"],
        unique:true,
        minlength:2,
    },
    AcceptTermsAndConditions:{
        type:String,
        required:[true,'Please Provide Accept Terms And Conditions'],
        maxlength:4,
        minlength:1
    },
    locationOrAddress:{
        type:String,
        required:[true,'Please Provide Your location or address'],
        maxlength:100,
        minlength:1
    },
    birthday:{
        type:String,
        required:[false,'Please Provide Your Birthday in the format (YYYY/MM/DD)'],
        maxlength:12,
        minlength:1
    },
    IdNumber:{
        type:String,
        required:[true,'Please Provide Your ID Number'],
        maxlength:13,
        minlength:1
    },
    IdDocumentLink:{
        //id document upload
        type:String
    },
    gender:{
        type:String,
        default:'male'
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
    }
})

BusinessOwnerRegistrationSchema.pre('save',async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
})

BusinessOwnerRegistrationSchema.methods.createJWT=function(){
    return jwt.sign({userId:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}

BusinessOwnerRegistrationSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword,this.password);
    return isMatch
} 
module.exports=mongoose.model('BusinessOwner',BusinessOwnerRegistrationSchema)