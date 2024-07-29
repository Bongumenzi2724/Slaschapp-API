const Accounts=require('../models/AccountSchema');
const Cash_Out=require('../models/CashOutRequests');
const BusinessOwner=require('../models/BusinessOwnerRegistration');

const create_bank_account=async(req,res)=>{
    try {
        const accountName=req.body.accountName;
        const amount=req.body.amount;
        const bankName=req.body.bankName;
        const accountType=req.body.accountType;
        const accountNumber=req.body.accountNumber;
        const branchCode=req.body.branchCode;
        const ownerId=req.params.owner_id;

        const account=new Accounts({
            accountName:accountName,
            bankName:bankName,
            accountType:accountType,
            Amount:amount,
            accountNumber:accountNumber,
            branchCode:branchCode,
            owner:ownerId
        });

        await account.save();
        return res.status(201).json({message:"Account Details Added Successfully",account:account});

    } catch (error) {
        return res.status(201).json({message:error.message});

    }
}

//pull bank accounts
const get_all_owner_accounts=async(req,res)=>{

    try {
        const bank_accounts=await Accounts.find({owner:req.params.owner_id});
        if(!bank_accounts){
            return res.status(404).json({message:"Owner does not have account records",status:false})
        }

        return res.status(200).json({bank_accounts:bank_accounts,status:true});
    } catch (error) {
        return res.status(500).json({message:error.message,status:false})
    }
}
//Add Cash Out Requests
const create_cash_out_requests=async(req,res)=>{
    try {
        const amount=req.body.amount;
        const ownerId=req.params.owner_id;
        const account_id=req.params.account_id;
        const account=await Accounts.findById({_id:account_id});
        if(!account){
            return res.status(404).json({message:"account does not exist"});
        }
        const owner=await BusinessOwner.findById({_id:ownerId});
        if(!owner){
            return res.status(404).json({message:"owner does not exist"});
        }
        const status="Pending".toLowerCase();
            const cash_out=new Cash_Out({
                Account_ID:account_id,
                Amount:amount,
                Status:status,
                Owner:ownerId
            });
        await cash_out.save();
        return res.status(200).json({message:"Request Pending",request:cash_out});

       /*  if(owner.wallet>=amount){
            // create cash out
            const status="Active".toLowerCase();
            const cash_out=new Cash_Out({
                Account_ID:account_id,
                Amount:amount,
                Status:status,
                Owner:ownerId
            });
            await cash_out.save();
            return res.status(200).json({message:"Request Active",request:cash_out});
        }

        else if(owner.wallet<amount){
            const status="Declined".toLowerCase();

            const cash_out=new Cash_Out({
                Account_ID:account_id,
                Amount:amount,
                Status:status,
                Owner:ownerId
            });
            await cash_out.save();
            return res.status(200).json({message:"Request Declined,Wallet Does Not Have Enough Funds",request:cash_out});
        }

        else{
            const status="Completed".toLowerCase();
            const cash_out=new Cash_Out({
                Account_ID:account_id,
                Amount:amount,
                Status:status,
                Owner:ownerId
            });
            await cash_out.save();
            return res.status(200).json({message:"Request Completed",request:cash_out});
        }   */
    

        } catch (error) {
        return res.status(500).json({message:"Add Cash Out Requests"})
    }
}

//pull cash out requests by owner
const get_all_requests=async(req,res)=>{
    try {

        const requests=await Cash_Out.find({Owner:req.params.owner_id});
      
        if(!requests){
            return res.status(404).json({message:"No requests exist for this owner"});
        }
        else{
        return res.status(200).json({requests:requests});

        }
    } catch (error) {
        return res.status(500).json({message:error.message,status:false});
    }
}

//get all requests (will be used by admin)

const admin_get_all_requests=async(req,res)=>{
    try {
        const requests=await Cash_Out.find({});

        if(!requests){
            return res.status(404).json({message:"No requests exist for this owner"});
        }
        else{
        return res.status(200).json({requests:requests});
        }
    } catch (error) {
        return res.status(500).json({message:error.message,status:false});
    }
}
//Change the status of the cash out request

const admin_get_status_requests=async(req,res)=>{
    const {status}=req.body;
    const {request_id}=req.params;
    const request=await Cash_Out.findById({_id:request_id});
    if(!request){
        return res.status(404).json({message:`Request with id ${request_id} does not exist`});
    }

    request.Status=status;
    let newRequest=request;
    await Cash_Out.findByIdAndUpdate({_id:request_id},{$set:newRequest},{new:true});
    await newRequest.save();

    return res.status(200).json({message:`Status successfully updated to ${newRequest.Status}`});

}

//Change Cash Request Status
const change_cash_request_status=async(req,res)=>{
    try {
        const {status}=req.body.status;
        const {request_id}=req.params;
        const request=await Cash_Out.findById({_id:request_id});
        if(!request){
            return res.status(404).json({message:"The request does not exits"});
        }
        request.Status=status;
        let newRequest=request;
        await Cash_Out.findByIdAndUpdate({_id:request_id},{$set:newRequest},{new:true});
        await newRequest.save();
        return res.status(200).json({message:`Status updated successfully to ${newRequest.Status}`})
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}
module.exports={create_bank_account,admin_get_status_requests,admin_get_all_requests,get_all_owner_accounts,create_cash_out_requests, get_all_requests,change_cash_request_status}