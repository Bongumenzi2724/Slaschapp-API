const Cart = require("../models/Cart");

const getCart=async(req,res)=>{
    res.status(200).json({status:true,message:"Get Cart",cartID:req.params.cartID})
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
            console.log(existingBait.totalPrice)
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
   console.log(req.params.cartItemID,"",req.params.userID)
   try {
        await Cart.findByIdAndDelete({_id:cartItemID});
        count=await Cart.countDocuments({userID:userID});
        return res.status(200).json({status:true,count:count,message:"Cart Item Removed"});
    } catch (error) {
        return res.status(500).json({status:false,message:error.message});
    } 
    //res.status(200).json({status:true,message:"Remove Bait From Cart",cartItemID:req.params.cartItemID,userID:req.params.userID})
}

const decrementBaitQuantity=async(req,res)=>{
    //const userId=req.user.id;
    const id=req.params.id;
    try {
        const cartItem=await Cart.findById(id);
        if(cartItem){
            const productPrice=cartItem.totalPrice/cartItem.quantity;
            if(cartItem.quantity>1){
                cartItem.quantity-=1;
                cartItem.totalPrice-=productPrice;
                await cartItem.save();
                return res.status(200).json({status:true,message:"Product quantity successfully decremented",quantity:cartItem.quantity});
            }else{
                await Cart.findOneAndDelete({_id:id});
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
    res.status(200).json({status:true,message:"Get Cart Count",cartID:req.params.cartID})

}

module.exports={getCart,addBaitToCart,removeBaitFromCart,decrementBaitQuantity,getCartCount}