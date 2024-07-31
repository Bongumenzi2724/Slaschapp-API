const mongoose=require('mongoose') 

const AdminSchema=new mongoose.Schema({

    name:{
        type:String,
        lowercase:true,
        default:'adlinc admin'
    },
    password:{
        type:String,
        default:'adlincAdminSlasch',
        lowercase:true
    },
    email:{
        type:String,
        required:[true,'Please Provide Your Email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',],
        unique:true,
        lowercase:true
    },
    lastName:{
        type:String,
        required:[false,'Please Provide Your Last Name']
    },
    wallet:{
        type:Number,
        required:false,
        default:0
    }

});


AdminSchema.methods.comparePassword=function(password,existingPassword){

    let isMatch=false;
    if(password===existingPassword){
        isMatch=true;
        return isMatch;
    }
    else{
        isMatch=false;
        return isMatch;
    }
} 

module.exports=mongoose.model('Admin',AdminSchema);