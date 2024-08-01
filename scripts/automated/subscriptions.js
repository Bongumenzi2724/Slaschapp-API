const Subscription=require('../../models/SubscriptionSchema');
const Owner=require('../../models/BusinessOwnerRegistration');
const Auction=require('../../models/AuctionSchema');
const Admin=require('../../models/AdminSchema');
const automatedEmail=require('../../utils/automatedEmail');
const cron=require('node-cron');

//run this script on the first of every month at 00:00 am to check for paid and unpaid subscription deactivate all auctions

cron.schedule('0 0 1 * *',async()=>{
    //managing subscriptions script

    //run this script on first of each month
    //find all owners and pay their subscription from their wallets if possible
    const owners=await Owner.find({});
    //find the admin to update its wallet
    const admin=await Admin.find({});
    //check every owners wallet for subscription payments
    for(let i=0;i<=owners.length-1;i++){
        //get the owner's id
        const owner_id=(owners[i]._id).toString();
        //find the subscription
        const subscription=await Subscription.find({createdBy:owner_id});
        //ensure that the subscription is not a free trial
        subscription.freeTrial=false;
        //check if the owner's wallet has enough money to pay for the subscription

        if(owners[i].wallet<79.99){

            //find all auctions specific to the this owner without subscription fee
            //const auctions=await Auction.find({createdBy:owner_id});
            //notification for unpaid subscription fee and update subscription status
            //update the subscription paymentStatus to unpaid
            subscription.paymentStatus='unpaid';
            //unpdate the subscription status to inactive
            subscription.subscriptionStatus='inactive';
            //new subscription to update
            let newSubscription=subscription;
            //update the owner's subscription to unpaid and make it inactive
            await Subscription.findByIdAndUpdate({_id:(subscription._id).toString()},{$set:newSubscription},{new:true});
            //save the new subscription details
            await newSubscription.save();
            //notify the owner of the unpaid subscription via email
            automatedEmail(owners[i].email,'Unpaid Subscription Auctions Will Be Deactivated');

            //deactivate all the auctions 
           /*  for(let i=0;i<=auctions.length-1;i++){
                //update status to revoked for all these auctions
                auctions[i].status='Revoked';
                //new auctions for updates
                let newAuction=auctions;
                //update the ith auction status 
                await Auction.findByIdAndUpdate({_id:newAuction._id.toString()},{$set:newAuction},{new:true});
                //Save all the new updates
                await newAuction.save();

            } */
            
            //deactivate auctions using updateMany
            const updates=await Auction.updateMany({createdBy:owner_id},{$set:{status:'Revoked'}},{multi:true});
            //save the updated documents
            await updates.save();
        }
        //else pay the subscription if the owner has enough money in the wallet to pay

        else{
            //pay the subscription fee to the admin wallet from the owners' wallet
            let subscriptionFee=subscription.subscriptionFee;
            //pay the subscription fee from the owner's wallet
            owners[i].wallet-=subscriptionFee;
            //update the admin's wallet with the subscription fee
            admin.wallet+=subscriptionFee;
            //new admin to update the subscription
            let newAdmin=admin;
            //find the admin to update the admin's wallet
            await Admin.findOneAndUpdate({email:admin.email},{$set:newAdmin},{new:true});
            //save the new admin
            await newAdmin.save();
            //update the subscription payment status to paid
            subscription.paymentStatus='active';
            subscription.freeTrial=false;
            let newSubscription=subscription;
            await Subscription.findByIdAndUpdate({_id:(subscription._id).toString()},{$set:newSubscription},{new:true});
            await newSubscription.save();
            //notify owner of the paid subscription via email
            automatedEmail(owners.email,'Subscription Paid');
            //ensure that all owner's auctions are active 
            //const auctions=await Auction.find({createdBy:owner_id});
            //update all the auctions's statuses to active
           /*  for(let i=0;i<=auctions.length-1;i++){
                //update each auction's status
                auctions[i].status='active';
                //new auction instance to save in the updated document
                let newAuction=auctions[i];
                //find the specific auction by id and save the updates made
                await Auction.findByIdAndUpdate({_id:auctions[i]._id.toString()},{$set:newAuction},{new:true});
                //save the auction;
                await newAuction.save();
            } */
            
            const updates=await Auction.updateMany({createdBy:owner_id},{$set:{status:'active'}},{multi:true});
            //save the documents
            await updates.save();

        }
    }
});

//Send Remainder for upcoming Billing
cron.schedule('0 0 * * *',async()=>{
    const subscriptions=await Subscription.find({nextBillingdate:{$lt:new Date(Date.now()+7*24*60*60*1000)}});
    for(const subscription of subscriptions){
        const owner=await Owner.find({_id:(subscription.createdBy).toString()});
        //send email remainder to pay subscription
        automatedEmail(owner.email,'Subscription Due At The End Of the Month');
    }
});



