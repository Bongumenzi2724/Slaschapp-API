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
    password:{
        type:String,
        required:[true,"Please Provide Your Password"],
        unique:true
    },
    wallet:{
        type:Number
    }

});

module.exports=mongoose.model('Admin',AdminSchema);