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
    console.log("Updated owner wallet");
    console.log(ownerWallet);
    owner.wallet-=auction.acquisitionBid;
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
    cart_user.rewards+=auction.acquisitionBid*0.60;
    adminDocument.wallet+=auction.acquisitionBid*0.40;
    //update the cart
    let newUserCart=cart_user;
    await User.findByIdAndUpdate({_id:userId},{$set:newUserCart},{new:true});
    await newUserCart.save();
    let newAdmin=adminDocument;
    //update the admin
    await Admin.findByIdAndUpdate({_id:(adminDocument._id).toString()},{$set:newAdmin},{new:true});
    await newAdmin.save();
    
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

    if(owner.wallet<auction.acquisitionBid){
        return res.status(403).json({message:`Transaction cannot be processed: Business owner ${owner.firstname} has insufficient funds`});
    }
    //Subtract cart total from user rewards

    if(user.rewards<cart.totalCartPrice){
        return res.status(403).json({message:"Insufficient rewards to process payment try another method"});
    }
    user.rewards-=cart.totalCartPrice;
    let newUser=user;

    //user.rewards+=auction.acquisitionBid*0.60;
    adminDocument.wallet+=auction.acquisitionBid;

    let newAdmin=adminDocument;
    //update admin wallet
  
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
    owner.wallet+=cart.totalCartPrice;
    owner.wallet-=auction.acquisitionBid;
    //total acquisition bids paid 
    owner.totalAcquisitionBidPaid+=auction.acquisitionBid;

    let newOwner=owner;
    console.log("Updated Wallet")
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