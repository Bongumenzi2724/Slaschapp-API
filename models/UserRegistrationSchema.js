const mongoose=require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserSchema = new mongoose.Schema({
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
        type:String,
        required:[true,'Please Provide Your Profile Picture'],
        maxlength:10000,
        minlength:1
    },
    phoneNumber:{
        type:String,
        required:[false,"Please Provide Your Phone Number"],
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
    educationStatus:{
        type:String,
        required:[true,'Please Provide Your Education Status'],
        enum:['High School','Tertiary','Other'],
        required:[true,'Please Provide Your Education Status'],
        default:'Other'
    },
    employmentStatus:{
        type:String,
        enum:['unemployed','employed','interviewing'],
        default:'unemployed'
    },
    gender:{
        type:String,
        enum:['Male','Female','Rather not say'],
        default:'male'
    },
    interests:{
        type:String,
        required:[true,'Please Provide Your Interests'],
        maxlength:10000,
        minlength:1
    },
    resetToken:{
        type:String,
        required:[false,'Please Provide the Expiration Time Of The Token']
    },
    resetTokenExpiration:{
        type:String,
        required:[false,'Please Provide the Expiration Time Of The Token']
    },
});

UserSchema.pre('save',async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    //this.resetToken=undefined;
    //this.resetTokenExpiration=undefined;
})

UserSchema.methods.createJWT=function(){
    return jwt.sign({userId:this._id,name:this.name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}

UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword,this.password);
    return isMatch
} 
module.exports=mongoose.model('User',UserSchema)