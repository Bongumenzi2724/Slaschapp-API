const User = require("../models/UserRegistrationSchema");
const BusinessOwnerRegistration = require('../models/BusinessOwnerRegistration');
const Cart = require("../models/Cart");
const Admin = require("../models/AdminSchema");
const AuctionSchema=require('../models/AuctionSchema');
//payment controller

const payment_controller=async(req,res)=>{
   // find the cart being processed
   const admin=await Admin.find({});
   let adminDocument=admin[0];
   const {cart_id}=req.params;
   const {otp}=req.body
   const cart=await Cart.findOne({_id:cart_id});
   if(!cart){
    return res.status(404).json({message:`The Cart with ${cart_id} does not exist`})
   }
   const userId=(cart.userId).toString();
   //return the total amount of acquisition bid each time a transaction is completed an return at login,register, and when we read the profile all this is under business owner

   if(cart.paymentMethod=="Cash" && cart.cartOTP==otp){
   
    //find the user to update the rewards
    const cart_user=await User.findById({_id:userId});

    if(!cart_user){
        return res.status(404).json({message:"user does not exist"});
    }

    //find the auction
    const auctionID=(cart.auctionId).toString();

    const auction=await AuctionSchema.findById({_id:auctionID});

    if(!auction){
        return res.status(404).json({message:"Auction does not exist"});
    }
    const businessID=(auction.createdBy).toString();
    const owner=await BusinessOwnerRegistration.findById({_id:businessID});
    if(!owner){
        return res.status(404).json({message:"Business Owner No Longer Exist"});
    }

    if(owner.wallet<auction.acquisitionBid){
        return res.status(422).json({message:`Transaction cannot be processed: Business owner ${owner.firstname} has insufficient funds`});
    }

    //update the owner wallet and total acquisition bid paid
    owner.totalAcquisitionBidPaid+=auction.acquisitionBid;
    //needs attentions
    console.log("Auction Acquisition Bid");
    console.log(auction.acquisitionBid);
    console.log("initial owner wallet");
    console.log(owner.wallet)
    let ownerWallet=owner.wallet - auction.acquisitionBid;
    owner.wallet=ownerWallet;
    console.log("Updated owner wallet value");
    console.log(ownerWallet);
    //owner.wallet-=auction.acquisitionBid;
    let newOwner=owner;

    const ownerID=(owner._id).toString();
    await BusinessOwnerRegistration.findByIdAndUpdate({_id:ownerID},{$set:newOwner},{new:true});
    await newOwner.save();
    //Add Acquisition Bid to user rewards
    cart.status="Completed";
    let newCart=cart;
    //update the cart status
    await Cart.findByIdAndUpdate({_id:cart_id},{$set:newCart},{new:true});
    await newCart.save();
    console.log("User rewards before adding acquisition");
    console.log(cart_user.rewards);
    cart_user.rewards+=auction.acquisitionBid*0.60;
    console.log("Admin Wallet Before Adding Acquisition Bid")
    console.log(adminDocument.wallet);
    adminDocument.wallet+=auction.acquisitionBid*0.40;
    //update the cart
    let newUserCart=cart_user;
    console.log("Updated Rewards")
    console.log(newUserCart.rewards);
    
    await User.findByIdAndUpdate({_id:userId},{$set:newUserCart},{new:true});
    await newUserCart.save();
    let newAdmin=adminDocument;
    //update the admin
    await Admin.findByIdAndUpdate({_id:(adminDocument._id).toString()},{$set:newAdmin},{new:true});
    await newAdmin.save();
    console.log("Admin Wallet After Adding Acquisition Bid");
    console.log(newAdmin.wallet);
    //find the business owner to update the wallet
    // Add cart total to owner wallet
    
    return res.status(200).json({message:"Payment Processed Successfully"});
   }


   else if(cart.paymentMethod==="Slasch Wallet")
   {
    //find the user 
    const user=await User.findById({_id:userId});
    if(!user){
        return res.status(404).json({message:`user with id ${userId} does not exist`});
    }

    //find the auction id
    const auctionID=(cart.auctionId).toString();

    //find the auction
    const auction=await AuctionSchema.findById({_id:auctionID});

    if(!auction){
        return res.status(404).json({message:"Auction does not exist"});
    }
    //find the business owner id
    const businessID=(auction.createdBy).toString();
    //find the business owner
    const owner=await BusinessOwnerRegistration.findById({_id:businessID});
    if(!owner){
        return res.status(404).json({message:"Business Owner No Longer Exist"});
    }

    //test the owner's wallet and the acquisition bid's equality

    if(owner.wallet<auction.acquisitionBid){
        return res.status(403).json({message:`Transaction cannot be processed: Business owner ${owner.firstname} has insufficient funds`});
    }

    //Subtract total from user wallet
    if(user.wallet<cart.totalCartPrice){
        return res.status(403).json({message:"Insufficient rewards to process payment try another method"});
    }
    user.wallet-=cart.totalCartPrice;
    let newUserWallet=user;
    await User.findByIdAndUpdate({_id:userId},{$set:newUserWallet},{new:true});
    //save the new user
    await newUserWallet.save();

    // Add acquisition bid to user rewards
    // find auction 
    user.rewards+=auction.acquisitionBid*0.60;
    //add a portion of the acquisition bid to the admin's wallet
    adminDocument.wallet+=auction.acquisitionBid*0.40;
    let newAdmin=adminDocument;
    //update admin wallet
    await Admin.findByIdAndUpdate({_id:(adminDocument._id).toString()},{$set:newAdmin},{new:true});
    await newAdmin.save();
    //update user
    let newUserReward=user;
    await User.findByIdAndUpdate({_id:userId},{$set:newUserReward},{new:true});
    await newUserReward.save();

    //Update Cart
    cart.status="Completed";
    let newCart=cart;
    await Cart.findByIdAndUpdate({_id:cart_id},{$set:newCart},{new:true});
    await newCart.save();
    //Add Cart total to owner wallet
    owner.wallet+=cart.totalCartPrice;

    //subtract the acquisition bid from the owner's wallet,needs attention
    console.log("Auction Acquisition Bid");
    console.log(auction.acquisitionBid);
    console.log("Onwer Initial Wallet");
    console.log(owner.wallet)

    owner.wallet-=auction.acquisitionBid;

    //total acquation bids paid
    owner.totalAcquisitionBidPaid+=auction.acquisitionBid;
    //update the new owner
    let newOwner=owner;
    console.log("Owner Updated Wallet");
    console.log(newOwner.wallet);

    await BusinessOwnerRegistration.findByIdAndUpdate({_id:businessID},{$set:newOwner},{new:true});
    await newOwner.save();
    return res.status(200).json({message:"wallet payment processed successfully"});
   }

   
   else if(cart.paymentMethod==="Slasch Rewards"){
   
    const user=await User.findById({_id:userId});
   
    if(!user){
        return res.status(404).json({message:`user with id ${userId} does not exist`});
    }
    //1.find the auction id;
    const auctionID=(cart.auctionId).toString();

    //find the auction 
    const auction=await AuctionSchema.findById({_id:auctionID});

    if(!auction){
        return res.status(404).json({message:"Auction does not exist therefore the business too"})
    }
    //find the business id
    const businessID=(auction.createdBy).toString();
    //find the business owner
    const owner=await BusinessOwnerRegistration.findById({_id:businessID});
    
    if(!owner){
        return res.status(404).json({message:"Business Owner Does Not Exist"});
    }

    //test the owner's wallet and the acquisition bid's equality
    console.log("owner name");
    console.log(owner.firstname);
    console.log("owner total acquisition bid paid");
    console.log(owner.totalAcquisitionBidPaid);
    console.log("total cart price");
    console.log(cart.totalCartPrice);
    if(owner.wallet<auction.acquisitionBid){
        return res.status(403).json({message:`Transaction cannot be processed: Business owner ${owner.firstname} has insufficient funds`});
    }
    //Subtract cart total from user rewards

    if(user.rewards<cart.totalCartPrice){
        return res.status(403).json({message:"Insufficient rewards to process payment try another method"});
    }
    console.log("Old User rewards");
    console.log(user.rewards);
    user.rewards-=cart.totalCartPrice;
    let newUser=user;
    console.log("User Rewards");
    console.log(user.rewards);
    console.log("Admin Wallet");
    console.log(adminDocument.wallet);
    //user.rewards+=auction.acquisitionBid*0.60;
    adminDocument.wallet+=auction.acquisitionBid;

    let newAdmin=adminDocument;
    //update admin wallet
    console.log("Updated Admin Wallet");
    console.log(newAdmin.wallet);
    await Admin.findByIdAndUpdate({_id:(adminDocument._id).toString()},{$set:newAdmin},{new:true});
    await newAdmin.save();
    console.log("New Admin email after update");
    console.log(newAdmin.email);
    //update user with rewards
    await User.findByIdAndUpdate({_id:userId},{$set:newUser},{new:true});
    await newUser.save();
    
    //Add cart total to business owner wallet
    console.log("Auction Acquisition Bid");
    console.log(auction.acquisitionBid);
    console.log("Initial Wallet Value")
    console.log(owner.wallet)

    owner.wallet+=cart.totalCartPrice;
    console.log("New Wallet Value After Adding total cart price")
    console.log(owner.wallet);
    owner.wallet-=auction.acquisitionBid;
    //total acquisition bids paid
    console.log("Total Acquisition Bid Paid B4 Update"); 
    console.log(owner.totalAcquisitionBidPaid);
    owner.totalAcquisitionBidPaid+=auction.acquisitionBid;

    console.log("Total Acquisition Bid Paid After Update");
    console.log(owner.totalAcquisitionBidPaid)
    let newOwner=owner;
    console.log("Updated Wallet After Adding the total cart price and subtracting the acquisition bid")
    console.log(newOwner.wallet);
    await BusinessOwnerRegistration.findByIdAndUpdate({_id:businessID},{$set:newOwner},{new:true});
    await newOwner.save();
    
    //Update Cart
    cart.status="Completed";
    let newCart=cart;
    await Cart.findByIdAndUpdate({_id:cart_id},{$set:newCart},{new:true});
    await newCart.save();
   
    return res.status(200).json({message:"Rewards Payment Processed Successfully"});
   }

   else{
    return res.status(404).json({message:"Payment method provided cannot be processed"})
   }

}

module.exports={payment_controller}