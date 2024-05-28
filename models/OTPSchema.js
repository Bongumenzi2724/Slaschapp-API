const mongoose= require("mongoose")

const OTPSchema = new mongoose.Schema({
    otp:{type:String},
	expires:{type:Date}
})

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;