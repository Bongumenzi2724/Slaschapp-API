const Cart = require("../models/Cart");


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
    //const userId="6634bfb784e9bf0c9788e950";
    const baits=req.body.baits;
    const paymentMethod=req.body.paymentMethod;
    const totalCartPrice=req.body.totalCartPrice;
    const totalCartQuantity=req.body.totalCartQuantity;

    let expiryDate1=new Date();
    expiryDate1.setTime(expiryDate1.getTime()+(30*24*60*60*100))
  /*   let totalCartPrice=0;
    let totalBaitsQuantity=0;
    for(let j=0;j<=baits.length-1;j++){
        totalCartPrice+=baits.price;
        totalBaitsQuantity+=baits.quantity;
    } */

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
        const AllOrders=await Cart.findById({userId:userId});
        return res.status(200).json({orders:AllOrders})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
    
    
}


module.exports={getCart,updateCart,create_cart, getAllOrders}