//The ability to link/add a bank account/card/payment method

const add_bank_account=async(req,res)=>{
    console.log("Add Bank Account");
    res.status(201).json({message:"Add Bank Account/Card"});
}

//The ability to transfer funds from the user bank account to the users in app wallet

const transfer_funds=async(req,res)=>{
    console.log("Transfer Funds");
    res.status(200).json({message:"Transfer Funds"});
}

module.exports={add_bank_account,transfer_funds}