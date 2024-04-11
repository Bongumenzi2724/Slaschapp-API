const mongoose=require('mongoose');

const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,'Please Provide Email For Your Email']
    },
    otp:{
        type:String,
        required:[true,'Please Provide OTP']
    }
});

module.exports=mongoose.model('Otps',otpSchema);