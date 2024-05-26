const owner = req.user._id;
const { itemId, quantity } = req.body;
try {
const cart = await Cart.findOne({ owner });
if(!cart){
    return res.status(500).json({message:"Cart Does Not Exist"});
}
const item = await Item.findOne({ _id: itemId });
if (!item) {
res.status(404).send({ message: "item not found" });
return;
}
const price = item.price;
const name = item.name;
//If cart already exists for user,
if (cart) {
const itemIndex = cart.items.findIndex((item) => item.itemId ==
itemId);
if (itemIndex > -1) {
let product = cart.items[itemIndex];
product.quantity += quantity;
cart.bill = cart.items.reduce((acc, curr) => {
return acc + curr.quantity * curr.price;
},0)
cart.items[itemIndex] = product;
await cart.save();
res.status(200).send(cart);
} else {
cart.items.push({ itemId, name, quantity, price });
cart.bill = cart.items.reduce((acc, curr) => {
return acc + curr.quantity * curr.price;
},0)
await cart.save();
res.status(200).send(cart);
}
} else {
//no cart exists, create one
const newCart = await Cart.create({
owner,
items: [{ itemId, name, quantity, price }],
bill: quantity * price,
});
return res.status(201).send(newCart);
}
} catch (error) {
console.log(error);
res.status(500).send("something went wrong");
}

const addBaitToCart=async(req,res)=>{
    try {
        const cartId = req.body.cartId;
        const baitId = req.body.baitId;
        const quantity = req.body.quantity;
        const auctionId = req.body.auctionId;
        const auctionName= req.body.auctionName;
        const paymentMethod=req.body.paymentMethod;
        const code=req.body.code;
        const status=req.body.status;
        //Find a cart by cartId
        //return res.status(200).json({response:req.body});
        // find the cart by id

        //find the bait by id
        const bait=await Bait.findById(baitId);
    
        /*if(!bait){
            //return res.status(404).json({status:false,bait:!bait});
        } */
       //find the cart by id
       const cart=await Cart.findById(cartId);
       if(!cart){
        //Create A New Cart
        //1. Create An to store the auctions array
        let auctionsArray=[];
        auctionsArray.push({auctionId:auctionId,auctionName:auctionName})
        //2. Create a bait array to store the baits array
        let baitsArray=[];
        //3. Set the expiry date
        let expiryDate1=new Date();
        expiryDate1.setTime(expiryDate1.getTime()+(30*24*60*60*100))
        console.log(bait.price*quantity)
        baitsArray.push({baitId:baitId,baitName:bait.baitPlantName,quantity:quantity,price:bait.price*quantity,size:bait.size,color:bait.color})
        //3. Create the overall cart object
        const newCart=new Cart({
            Auctions:auctionsArray,
            totalCartPrice:bait.price*quantity,
            totalCartQuantity:quantity,
            baits:baitsArray,
            status:status,
            code:code,
            paymentMethod:paymentMethod,
            expiryDate:expiryDate1
        })
        await newCart.save();
        return res.status(201).json({message:"New Cart Created",cart:newCart});
       }
       else{
        //update an existing cart
        //1.update the auctions 
        cart.Auctions.push({auctionId:auctionId,auctionName:auctionName});
        //2.elimate duplicate auctions
        cart.Auctions=[...new Set(existingCart.Auctions.map(JSON.stringify))].map(JSON.parse);
        //3. Check if the provided baitId is the same as the incoming baitId
        if(cart.baits.length==1&&baitId==cart.baits[0].baitId){
            //this means the bait is the same
            // bait quantity, bait price,totalCartPrice,and totalCartQuantity
            let baitQuantity=cart.baits[0].quantity+quantity;//bait quantity
            let baitPrice=bait.price*baitQuantity;//bait price
            //update the total cart quantity
            cart.totalCartQuantity=baitQuantity;
            //calculate the baits[0] quantity
            cart.baits[0].quantity=baitQuantity;
            //calculate the baits[0] price
            cart.baits[0].price=baitPrice;
            //save the update cart total quantity
            cart.totalCartPrice=baitPrice;
            //save the update cart total quantity
            const newCart1=cart;
            const newCart=await Cart.findByIdAndUpdate(cartId,{newCart1},{new:true});
            //return the updated cart
            return res.status(204).json({message:"Bait Added Successfully",cart:newCart})
        }
        //loop through the baits array and compare the existing baits with the incoming baitID
        let k;
        let baitPrice;
        let baitQuantity;

        for(let i=0;i<=cart.baits.length-1;i++){
            if(cart.baits[i].baitId==baitId){
                k=i;
                //update the bait price,bait quantity,totalCartPrice, and totalCartQuantity
                baitQuantity=cart.baits[i].quantity+quantity;
                //set the cart.baits[i].price
                baitPrice=bait.price*baitQuantity;
                //save the updates
                break;
                // return the updated cart
                // break if necessary
            }
        }
        if(k!=null){
             //set the bait price and quantity
            cart.baits[k].price=baitPrice;
            cart.baits[k].quantity=baitQuantity;
            //update the total cart price and quantity
            cart.totalCartPrice=cart.totalCartPrice+cart.baits[k].price;
            cart.totalCartQuantity=cart.totalCartQuantity+cart.baits[k].quantity; 
            //return the updated cart
            //const updatedCart=await Cart.findByIdAndUpdate()

        }

        //add the new bait in the baits array
        cart.baits.push({baitId:baitId,baitName:bait.baitPlantName,quantity:quantity,price:bait.price,size:bait.size,color:bait.size})
        //update the bait price,bait quantity,totalCartPrice, and totalCartQuantity
        //save the updates
        //return the cart
        console.log(cart);
       }
    }
    catch(error){
        return res.status(500).json({message:error.message});
    }
} 

