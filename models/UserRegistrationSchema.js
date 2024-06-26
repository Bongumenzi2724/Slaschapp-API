const mongoose=require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:[true,'Please Provide Your First Name']
    },
    secondname:{
        type:String,
        required:[false,'Please Provide Your Second Name']
    },
    surname:{
        type:String,
        required:[true,'Please Provide Your Surname']
    },
    profilePicture:{
        type:String
    },
    phoneNumber:{
        type:String,
        required:[false,"Please Provide Your Phone Number"],
    },
    email:{
        type:String,
        required:[false,'Please Provide Your Email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',],
    },
    password:{
        type:String,
        required:[false,"Please Provide Your Password"],
        unique:true
    },
    AcceptTermsAndConditions:{
        type:String,
        required:[true,'Please Provide Accept Terms And Conditions']
    },
    locationOrAddress:{
        type:String,
        required:[true,'Please Provide Your location or address']
    },
    birthday:{
        type:String,
        required:[false,'Please Provide Your Birthday in the format (YYYY/MM/DD)']
    },
    educationStatus:{
        type:String,
        required:[true,'Please Provide Your Education Status']
    },
    employmentStatus:{
        type:String
    },
    gender:{
        type:String
    },
    wallet:{
        type:Number
    },
    rewards:{
        type:Number
    },
    interests:{
        type:String,
        required:[true,'Please Provide Your Interests']
    },
    resetToken:{
        type:String,
        required:[false,'Please Provide the Expiration Time Of The Token']
    },
    resetTokenExpiration:{
        type:String,
        required:[false,'Please Provide the Expiration Time Of The Token']
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
    status:{
        type:String
    }
    
},{timestamps:true});

UserSchema.pre('save',async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
})

UserSchema.methods.createJWT=function(){
    return jwt.sign({userId:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}

UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword,this.password);
    return isMatch
} 
module.exports=mongoose.model('User',UserSchema)