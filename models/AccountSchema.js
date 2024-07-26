const mongoose=require('mongoose');

const AccountsSchema=new mongoose.Schema({

    accountName:{
        type:String,
        required:[true,'please provide the account name']

    },
    bankName:{
        type:String,
        required:[true,'please provide the bank name']
    },
    accountType:{
        type:String,
        required:[true,'Please provide the account type']
    },
    accountNumber:{
        type:String,
        unique:true,
        required:[true,'Please provide the account number']
    },
    branchCode:{
        type:String
    },
    owner:{
        type:mongoose.Types.ObjectId,
        ref:'BusinessOwner'
    }
},{timestamps:true});

module.exports=mongoose.model('Accounts',AccountsSchema);