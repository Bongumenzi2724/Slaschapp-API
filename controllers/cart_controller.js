const Cart = require("../models/Cart");
const {StatusCodes}=require('http-status-codes')
const generateOtp=require('../utils/generateOtp');
const sendEmail=require('../utils/sendEmail');
const User=require('../models/UserRegistrationSchema');
const { CardAction } = require("twilio/lib/rest/content/v1/content");


const getCart=async(req,res)=>{
    
    try {
        const cart=await Cart.findOne({_id:req.params.cartId});
        //check if the cart has expired
        if(!cart){
            return res.status(404).json({status:cart.status,messages:`The cart ${cart.status=="Expired"?"The Cart Has Expired":"The Cart Does Not Exist"}`})
        }
        //if the cart has expired return a new message
        return res.status(200).json({status:cart.status,cart:cart});
    } catch (error) {
        return res.status(500).json({status:false,message:error.message});
    }
}

const create_cart=async(req,res)=>{

   try {

    const auctionName=req.body.auctionName;
    const auctionId=req.body.auctionId;
    const status=req.body.status;
    const code=req.body.code;
    const userId=(req.user.userId).toString();
    const baits=req.body.baits;
    const paymentMethod=req.body.paymentMethod;
    const totalCartPrice=req.body.totalCartPrice;
    const totalCartQuantity=req.body.totalCartQuantity;
    const cartOTP="";
    let expiryDate1=new Date();
    expiryDate1.setTime(expiryDate1.getTime()+(30*24*60*60*100))

    if(auctionName==false||auctionId==false||status==false||code==false||baits==false||paymentMethod==false||totalCartPrice==false||totalCartQuantity==false){
        return res.status(StatusCodes.EXPECTATION_FAILED).json({message:"Please Provide All The Fields"})
    }
    
    const newCart=new Cart({
        userId:userId,
        auctionName:auctionName,
        auctionId:auctionId,
        totalCartPrice:totalCartPrice,
        totalCartQuantity:totalCartQuantity,
        baits:baits,
        status:status.toLowerCase(),
        code:code,
        paymentMethod:paymentMethod,
        expiryDate:expiryDate1,
        cartOTP:cartOTP
    });
    await newCart.save();
    return res.status(201).json({message:"New Cart Created",status:newCart.status,cart:newCart});

   } catch (error) {
    return res.status(500).json({message:error.message});
   }
}

const get_business_cart=async(req,res)=>{
    try{
    const userId=req.user.userId
    const orders=await Cart.aggregate([{
        $match:{
            userId:`${userId}`,
            auctionId:req.params.auctionId,
            status:{
            $in:["Complete","Expired","Cancelled","In-Progress"]
        }}
    }]);
    if(!orders){
        return res.status(404).json({message:"No resource exist"})
    }
    
    return res.status(200).json({orders:orders});
}
catch(error){
    return res.status(500).json({message:error.message});
}
}

const user_orders=async(req,res)=>{
    try {
        const user_orders=await Cart.find({userId:req.user.userId});
        return res.status(200).json({owner_orders:user_orders});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:error.message})
    }
}

const update_Cart_Status=async(req,res)=>{
    //updating the cart means updating the status of the cart
    try {
        const cart=await Cart.findOne({userId:req.user.userId,_id:req.params.cartId});

        if(!cart||cart.status=="Expired"){
            return res.status(404).json({status:false,message:`The cart requested has the following status : ${cart.status==="Expired" ? "Expired" : "The Cart Does Not Exist"}`})
        }
        //update the status of the cart
        cart.status=req.body.status;
        let newCart=cart;
        //console.log(newCart);
        await Cart.updateOne({userId:req.user.userId,_id:cart._id},{$set:newCart},{new:true,runValidators:true})
        return res.status(200).json({status:true,message:"Cart Status Successfully Updated"})
        
    } catch (error) {
        return res.status(500).json({status:false,message:error.message})
    }
    
}

const getAllOrders=async(req,res)=>{    
    try {
        const AllOrders=await Cart.findOne({userId:req.user.userId});
        return res.status(200).json({orders:AllOrders})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
    
    
}

const searchBasedOnCode=async(req,res)=>{
    try {
        
        const newCart=await Cart.find({code:req.params.code});   
        console.log(newCart);
        if(!newCart){
            return res.status(404).json({message:`Cart with code ${req.params.code} does not exist`})
        }
        if(newCart.length===0){
            return res.status(404).json({status:false,messages:`Cart with code:${req.params.code} Does Not Exist`});
        }
        return res.status(200).json({message:"Cart",cart:newCart})
    } catch (error) {

        return res.status(500).json({status:false,message:error.message});

    }
}

const update_cart_checkout=async(req,res)=>{
    try {
        const cart=await Cart.findById({_id:req.params.cartId});
        if(!cart){
            return res.status(StatusCodes.NOT_FOUND).json({message:"The Cart Does Not Exist"})
        }
        const userId=(cart.userId).toString();

        const user=await User.findById({_id:userId});

        console.log(user)
        if(!user){
            return res.status(404).json({message:"User Not Found"});
        }
        
        if(req.body.paymentMethod=="Cash"){
            const cartOTP=generateOtp();
            cart.cartOTP=cartOTP;
            cart.paymentMethod=req.body.paymentMethod;
            let newCart=cart;
            console.log("OTP");
            console.log(newCart.cartOTP);
            console.log("email");
            console.log(user.email);
            console.log("Payment Method");
            console.log(newCart.paymentMethod);
            await sendEmail(user.email,cartOTP);
            await Cart.findByIdAndUpdate({_id:req.params.cartId},{$set:newCart},{new:true})
            await newCart.save();

        }
        let updated_cart=await Cart.findByIdAndUpdate(req.params.cartId,req.body,{new:true});
        await updated_cart.save(); 
        return res.status(StatusCodes.OK).json({updated_cart:updated_cart});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:error.message})
    }
}

const update_cart_remove_item=async(req,res)=>{

    const cart_id=req.params.cartId;
    const cart=await Cart.findById({_id:cart_id});
    console.log(cart);
    if(!cart){
        return res.status(StatusCodes.NOT_FOUND).json({message:"The Cart Does Not Exist"})
    }
    await Cart.findByIdAndUpdate({_id:req.params.cartId},{$set:req.body},{new:true})
    await cart.save();
    console.log(cart);
    return res.status(200).json({message:"Cart update Successfully"});
}
//
module.exports={getCart,update_cart_checkout,update_cart_remove_item,user_orders,get_business_cart,create_cart, getAllOrders,searchBasedOnCode}