const Cart = require("../models/Cart");
const Bait = require('../models/BaitSchema');

const getCart=async(req,res)=>{
    
    try {
    const cart=await Cart.findOne({userId:req.user.userId});
    return res.status(200).json({status:true,cart:cart});
    } catch (error) {
        return res.status(500).json({status:false,message:error.message});
    }
}
//incude the bait id and the user id
const addBaitToCart=async(req,res)=>{
     const {totalPrice,quantity}=req.body;
     console.log(req.user.userId);
    let count;

    let itemsArray=[];
    try {
        const existingCart=await Cart.findOne({userId:req.user.userId});
        count=await Cart.countDocuments({userId:req.user.userId});
        if(!existingCart){
            itemsArray.push(req.params.baitID)
            const newCartItem=new Cart({
                userId:req.user.userId,
                totalPrice:totalPrice,
                quantity:quantity,
                items:itemsArray,
                status:req.body.status,
                code:req.body.code
            });
            await newCartItem.save();
            count=await Cart.countDocuments({userId:userId});
            return res.status(200).json({status:true,count:count,cart:newCartItem});
        }else{
            console.log(existingCart.items.length);
            for(let i=0;i<=existingCart.items.length-1;i++){
                if(existingCart.items[i]!==req.params.baitID){
                    existingCart.items.push(req.params.baitID);
                }
            }
            existingCart.items=[...new Set(existingCart.items)];
            existingCart.totalPrice+=Math.ceil(totalPrice*quantity);
            existingCart.quantity+=quantity;
            await existingCart.save();
            return res.status(200).json({status:true,count:count,existingCart:existingCart});
        }
    } catch (error) {
         return res.status(500).json({status:false,message:error.message});
    }  
}

const removeCartItem=async(req,res)=>{
    const cartItemId=req.params.id;
    const userId=req.user.id;
    try {
        await Cart.findByIdAndDelete({_id:cartItemId});
        count=await Cart.countDocuments({userId:userId});
        return res.status(200).json({status:true,count:count});
    } catch (error) {
        return res.status(500).json({status:false,message:error.message});
    }
    //res.status(200).json({status:true,message:"Remove Bait From Cart",cartItemID:req.params.cartItemID,userID:req.params.userID})
}


const decrementBaitQuantity=async(req,res)=>{
    const userId=req.user.id;
    //use baitID for filtering
    const baitID=req.params.baitID;
    try {
        //find the cart first by userId
        const cartItem=await Cart.findById(baitID);
        //if the cart exist find the 
        if(cartItem){
            const baitPrice=cartItem.totalPrice/cartItem.quantity;
            if(cartItem.quantity>1){
                cartItem.quantity-=1;
                cartItem.totalPrice-=baitPrice;
                await cartItem.save();
                return res.status(200).json({status:true,message:"Bait quantity successfully decremented",quantity:cartItem.quantity});
            }else{
                await Cart.findOneAndDelete({_id:cartID});
                return res.status(200).json({status:true,message:"Bait quantity successfully removed from the cart"});
            }
        }
        else{
            return res.status(400).json({status:false,message:"Product Does Not Exist"});
        }
    } catch (error) {
        return res.status(500).json({status:false,message:error.message});

    }
    //res.status(200).json({status:true,message:"Decrement Bait Quantity From Cart",baitID:req.params.baitID})
}

const getCartCount=async(req,res)=>{
    try {
    const count=await Cart.countDocuments({userId:req.user.userId});
    return res.status(200).json({status:true,count:count});
  
    } catch (error) {
    return res.status(500).json({status:false,message:error.message});
    }

}

module.exports={getCart,addBaitToCart,removeCartItem,decrementBaitQuantity,getCartCount}