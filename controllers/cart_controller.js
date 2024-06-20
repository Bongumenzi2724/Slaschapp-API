const Cart = require("../models/Cart");
const {StatusCodes}=require('http-status-codes')

const getCart=async(req,res)=>{
    
    try {
    const cart=await Cart.findOne({userId:req.user.userId,_id:req.params.cartId});
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
    const userId=req.user.userId;
    const baits=req.body.baits;
    const paymentMethod=req.body.paymentMethod;
    const totalCartPrice=req.body.totalCartPrice;
    const totalCartQuantity=req.body.totalCartQuantity;

    let expiryDate1=new Date();
    expiryDate1.setTime(expiryDate1.getTime()+(30*24*60*60*100))
  
    if(auctionName==false||auctionId==false||status==false||code==false||baits==false||paymentMethod==false||totalCartPrice==false||totalCartQuantity==false){
        return res.status(StatusCodes.EXPECTATION_FAILED).json({message:"Please Provide All The Fields"})
    }
    const newCart=new Cart({
        //set the userID
        userId:userId,
        auctionName:auctionName,
        auctionId:auctionId,
        totalCartPrice:totalCartPrice,
        totalCartQuantity:totalCartQuantity,
        baits:baits,
        status:status,
        code:code,
        paymentMethod:paymentMethod,
        expiryDate:expiryDate1
    })
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

const updateCart=async(req,res)=>{
    //updating the cart means updating the status of the cart
    try {
        const cart=await Cart.findOne({userId:req.user.userId,_id:req.params.cartId});
    
        console.log(cart)
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

        const AllOrders=await Cart.findById({userId:req.user.userId});
        return res.status(200).json({orders:AllOrders})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
    
    
}

const searchBasedOnCode=async(req,res)=>{
    const cart=await Cart.aggregate([{
        $match:{code:req.body.code,status:'Pending'}
    }])
    if(cart.status=="Complete"||cart.status=="Expired"){
        return res.status(StatusCodes.NOT_FOUND).json({message:`The requested has ${cart.status==='Complete'?'Completed':'Expired'}`});
    }
    cart.status='Complete';
    let newCart=cart;
    await Cart.updateOne({_id:cart._id},{$set:newCart},{new:true});
    return res.status(200).json({message:"Cart Complete",cart:newCart})
}


module.exports={getCart,updateCart,user_orders,get_business_cart,create_cart, getAllOrders,searchBasedOnCode}