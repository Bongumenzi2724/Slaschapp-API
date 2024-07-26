const Subscription=require('../models/SubscriptionSchema');
const User=require('../models/UserRegistrationSchema');
const Auction=require('../models/AuctionSchema');
const Business=require('../models/BusinessRegistrationSchema');
const Admin=require('../models/AdminSchema');
const Owners=require('../models/BusinessOwnerRegistration');

const create_subscription=async(req,res)=>{

    try {
        req.body.createdBy=req.user.userId;
        req.body.subscriptionStatus='active';
        req.body.paymentStatus='paid';
        //check if the user is already subscribed
        const previousSubscription=await Subscription.findOne({createdBy:req.body.createdBy});
        if(previousSubscription){
            return res.status(409).json({message:"Already Subscribed"});
        }

        //create new subscription
        const new_subscription=new Subscription({
            subscriptionStatus:req.body.subscriptionStatus,
            subscriptionDate:new Date.now(),
            nextBillingDate:new Date(new Date.now()+30*24*60*60*1000),
            paymentStatus:req.body.paymentStatus,
            createdBy: req.body.createdBy
        });
        
        await new_subscription.save();

        return res.status(200).json({message:"subscription created",status:new_subscription.subscriptionStatus});

    } catch (error) {
        return res.status(500).json({message:error.message})
    }

}

const cancel_subscription=async(req,res)=>{

   try {
    const subscription=await Subscription.findById({_id:req.params.subscription_id});

    if(!subscription){
        return res.status(404).json({message:`subscription with ${req.params.subscription_id} does not exist`});
    }
    subscription.subscriptionStatus='inactive';

    let newSubscription=subscription;

    await Subscription.findByIdAndUpdate({_id:req.params.subscription_id},{$set:newSubscription},{new:true});

    await newSubscription.save();

    return res.status(200).json({message:"subscription canceled"});
   } catch (error) {
    return res.status(500).json({message:error.message});
   }
}

const pay_subscription=async(req,res)=>{

  try {
      //find the subscription
      const {subscriptionFee,ownerId}=req.body;

      const subscription=await Subscription.findById({_id:req.params.subscription_id});

      if(!subscription){
          return res.status(404).json({message:`Subscription does not exist please create a new one`});
      }
      const owner=await Owners.findById({_id:subscription.createdBy.toString()});
      if(!owner){
        return res.status(404).json({message:"Owner Does Not Exist"});
      }
       //add the subscription fee to admin wallet
       const admin=await Admin.find({});
       //subtract subscription fee from the owner's wallet

       admin.wallet+=subscriptionFee;

       let newAdmin=admin;

       await Admin.findOneAndUpdate({email:admin.email},{$set:newAdmin},{new:true});

       await newAdmin.save();

       //update the subscription
       subscription.subscriptionStatus='active';
       let newSubscription=subscription;
       await Subscription.findByIdAndUpdate({_id:req.params.subscription_id},{$set:newSubscription},{new:true});
       await newSubscription.save()
       //update activate the necessary auction

       //const auction=await Auction.findById({businessId:businessId});

       const filter={createdBy:ownerId};

       const update={$set:{status:'active'}};

       const result=await Auction.updateMany(filter,update,{multi:true});
       await result.save();
       return res.status(200).json({message:"subscription paid"});

  } catch (error) {
    return res.status(500).json({message:error.message});
  }
}

module.exports={create_subscription,cancel_subscription,pay_subscription}