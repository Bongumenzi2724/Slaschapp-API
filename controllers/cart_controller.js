const Cart = require("../models/Cart");

const getCart=async(req,res)=>{
    const userId=req.user.id;
        try {
            const cart=await Cart.find({userId:userId}).populate({
                path:'cart',
                populate:{
                    path:'bait',
                    select:'time coords'
                }
            });

        return res.status(200).json({status:true,cart:cart});
        } catch (error) {
        return res.status(500).json({status:false,message:error.message});
        }
}
//incude the bait id and the user id
const addBaitToCart=async(req,res)=>{
    // userId=req.user.id;
    const {totalPrice,quantity}=req.body;
    const {baitID,userID}=req.params;
    let count;
    try {
        const existingBait=await Cart.findOne({userID:userID,baitID:baitID});
        count=await Cart.countDocuments({userID:userID});
        if(existingBait){
            existingBait.totalPrice+=totalPrice*quantity;
            existingBait.quantity+=quantity;
            await existingBait.save();
            return res.status(200).json({status:true,count:count,existingBait:existingBait});
        }else{
            const newCartItem=new Cart({
                userID:req.params.userID,
                baitID:req.params.baitID,
                totalPrice:totalPrice,
                quantity:quantity
            });
            await newCartItem.save();
            count=await Cart.countDocuments({userId:userID});
            return res.status(200).json({status:true,count:count,cart:newCartItem});
        }
    } catch (error) {
         return res.status(500).json({status:false,message:error.message});
    } 
}

const removeBaitFromCart=async(req,res)=>{
   console.log(req.params.baitID,"",req.params.userID)
   try {
        await Cart.findByIdAndDelete({_id:baitID});
        count=await Cart.countDocuments({userID:userID});
        return res.status(200).json({status:true,count:count,message:"Bait Item Removed Successfully"});
    } catch (error) {
        return res.status(500).json({status:false,message:error.message});
    } 
    //res.status(200).json({status:true,message:"Remove Bait From Cart",cartItemID:req.params.cartItemID,userID:req.params.userID})
}

const decrementBaitQuantity=async(req,res)=>{
    //const userId=req.user.id;
    //use baitID for filtering
    const {cartID}=req.params;
    try {
        const cartItem=await Cart.findById(cartID);
        if(cartItem){
            const productPrice=cartItem.totalPrice/cartItem.quantity;
            if(cartItem.quantity>1){
                cartItem.quantity-=1;
                cartItem.totalPrice-=productPrice;
                await cartItem.save();
                return res.status(200).json({status:true,message:"Product quantity successfully decremented",quantity:cartItem.quantity});
            }else{
                await Cart.findOneAndDelete({_id:cartID});
                return res.status(200).json({status:true,message:"Product quantity successfully removed from the cart"});
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
    const userID=req.user.id;
    try {
    const count=await Cart.countDocuments({userID:userID});
    return res.status(200).json({status:true,count:count});
  
    } catch (error) {
    return res.status(500).json({status:false,message:error.message});
    }

}

module.exports={getCart,addBaitToCart,removeBaitFromCart,decrementBaitQuantity,getCartCount}