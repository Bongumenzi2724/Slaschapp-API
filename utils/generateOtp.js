const otpGenerator=require('otp-generator');

const generateOTP=()=>{
        const otpCode=otpGenerator.generate(6, { upperCaseAlphabets: false,digits:true,specialChars: false,lowerCaseAlphabets:false });
        return otpCode;
}

module.exports=generateOTP