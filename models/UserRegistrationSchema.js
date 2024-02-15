const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')

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
    email:{
        type:String,
        required:[true,'Please Provide Your Email'],
        unique:true,
        minlength:2,
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
        enum:['Primary School','High School','Tertiary','Other'],
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
        enum:['male','female','other'],
        default:'male'
    },

    interests:{
        type:String,
        enum:['Music','Entertainment','Sports','Gaming','Fashion And Beauty','Food And Drinks','Business And Finance','Travel And Tourism','Technology And Service','Fashion And Jewellery','Outdoors','Fitness','Home Design'],
        default:'Entertainment'
    }
})

UserSchema.pre('save',async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
})

UserSchema.methods.createJWT=function(){
    return jwt.sign({userId:this._id,name:this.name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}

UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword,this.password);
    return isMatch
} 
module.exports=mongoose.model('User',UserSchema)