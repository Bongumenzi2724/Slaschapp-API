/*
 //const existingCart=await Cart.findOne({userId:req.user.userId});
        //count=await Cart.countDocuments({userId:req.body.ID});
        //1. Find the cart using user id
        const existingCart=await Cart.findOne({userId:req.body.userId})
        //if the cart exist find it using the user id

if(existingCart){
    existingCart.Auctions.push({auctionID:auctionID,auctionName:auction.campaignName});
    existingCart.Auctions=[...new Set(existingCart.Auctions.map(JSON.stringify))].map(JSON.parse);
    
    for(let j=0;j<=existingCart.baits.length-1;j++){

        if(existingCart.baits[j].baitID===req.params.baitID){
            //console.log(`BaitID ${j}," ", ${existingCart.baits[j].baitID}`)
            console.log("New Update");
            //console.log(existingCart.baits[j].baitID,"baitID",req.params.baitID)
            let quantity=existingCart.baits[j].quantity+req.body.quantity;
            console.log(`new bait Quantity ${quantity}`);
            existingCart.baits[j].quantity=quantity;
            console.log(`existing cart bait price ${existingCart.baits[j].totalBaitPrice}`)
            let totalPrice=bait.price*req.body.quantity;
            console.log(`new bait total price ${totalPrice}`);
            existingCart.baits[j].totalBaitPrice=totalPrice;
            //Saving Cart Update
            await existingCart.save();
            break;
        }
    }
    //existingCart.baits=[...new Set(existingCart.baits.map(JSON.stringify))].map(JSON.parse);
    //existingCart.totalPrice+=Math.ceil(req.body.quantity*bait.price);
    //existingCart.quantity+=req.body.quantity;
    return res.status(200).json({status:true,count:count,existingCart:existingCart});

}
// this code works if the cart does not exist
if(!existingCart){
    //set the cart expiry date
    const expiryDate=new Date();
    expiryDate.setTime(expiryDate.getTime()+(30*24*60*60*100));

    cartArray.push({baitID:baitID,baitName:bait.baitPlantName,totalBaitPrice:bait.price*req.body.quantity,quantity:req.body.quantity,size:bait.size,color:bait.color})

    auctionsArray.push({auctionID:auctionID,auctionName:auction.campaignName});

    const newCartItem=new Cart({
        //userID
        ID:req.body.ID,
        totalPrice:req.body.quantity*bait.price,
        quantity:req.body.quantity,
        Auctions:auctionsArray,
        baits:cartArray,
        status:req.body.status,
        code:req.body.code,
        paymentMethod:req.body.paymentMethod,
        expiryDate:expiryDate
    });
    await newCartItem.save();
    //count=await Cart.countDocuments({userId:userId});
    return res.status(200).json({status:true,cart:newCartItem});
}
/* else{
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
} */


const addBaitToCart=async(req,res)=>{
     
   
    try {
        let count;
        
        const baitID=req.params.baitID;

        const auctionID=req.params.auctionID;
      
        const auction=await AuctionSchema.findById(auctionID);

         if(!auction){
            return res.status(404).json({status:false,message:"Auction Does Not Exist"})
        }

        const bait=await Bait.findById(baitID);

        if(!bait){
            return res.status(404).json({status:false,message:"Bait Plant Does Not Exist"})
        } 

        const existingCart=await Cart.findOne({userId:req.body.userId});

        if(!existingCart){
            let cartArray=[];
            let auctionsArray=[];

            //set the cart expiry date
            const expiryDate=new Date();
            //first find out the number of baits in the cart and store them

            expiryDate.setTime(expiryDate.getTime()+(30*24*60*60*100));

            cartArray.push({baitID:baitID,baitName:bait.baitPlantName,totalBaitPrice:bait.price*req.body.quantity,quantity:req.body.quantity,size:bait.size,color:bait.color})

            auctionsArray.push({auctionID:auctionID,auctionName:auction.campaignName});

            const newCart=new Cart({
                //userID
                ID:req.body.ID,
                totalPrice:req.body.quantity*bait.price,
                quantity:req.body.quantity,
                Auctions:auctionsArray,
                baits:cartArray,
                status:req.body.status,
                code:req.body.code,
                paymentMethod:req.body.paymentMethod,
                expiryDate:expiryDate
            });

            await newCart.save();

            return res.status(201).json({newCart});
        }

        else{
            //populate the auction array
            existingCart.Auctions.push({auctionID:auctionID,auctionName:auction.campaignName});
            //eliminate duplicate auctions
            existingCart.Auctions=[...new Set(existingCart.Auctions.map(JSON.stringify))].map(JSON.parse);
            
            console.log(existingCart.baits.length===1);
            console.log(existingCart.baits[0].baitID===req.params.baitID);
            //assuming we load the same bait after navigating to another section of the app
            if(existingCart.baits.length===1 && existingCart.baits[0].baitID==baitID){
                existingCart.baits[0].quantity+=req.body.quantity;

                let totalPrice=bait.price*req.body.quantity;
                existingCart.baits[0].totalBaitPrice=existingCart.baits[0].totalBaitPrice+totalPrice;
                //Update the document here
                
                await existingCart.save();
                return res.status(200).json({status:true,existingCart:existingCart});
            }

            else{
                //look for the correct bait to update the quantity and bait plant price
                for(let j=0;j<=existingCart.baits.length-1;j++){

                 for(let i=0;i<=existingCart.baits.length-1;i++){
                    //adding new baits at the end of the baits array in the existing cart
                    if(i===existingCart.baits.length-1 && existingCart.baits[existingCart.baits.length-1].baitID !=req.params.baitID){
                        //push the new bait at the end of the baits array
                        existingCart.baits.push({baitID:req.params.baitID,baitName:bait.baitPlantName,totalBaitPrice:bait.price*req.body.quantity,quantity:req.body.quantity,size:bait.size,color:bait.color});
                    }
                }
                //find the correct baitID in the jth place of the existingCart.baits array and update the bait quantity and price
                // if the baitID at the jth element is equal to the baitID in request.params object
                if(existingCart.baits[j].baitID==req.params.baitID){
                    //console.log(`BaitID ${j}," ", ${existingCart.baits[j].baitID}`)
                    console.log("New Update");
                    //console.log(existingCart.baits[j].baitID,"baitID",req.params.baitID)
                    let quantity=existingCart.baits[j].quantity+req.body.quantity;
                    console.log(`new bait Quantity ${quantity}`);
                    existingCart.baits[j].quantity=quantity;
                    console.log(`existing cart bait price ${existingCart.baits[j].totalBaitPrice}`)
                    let totalPrice=bait.price*req.body.quantity;
                    console.log(`new bait total price ${totalPrice}`);
                    existingCart.baits[j].totalBaitPrice=totalPrice;

                    //Update the document here

                    //Saving Cart Update
                    await existingCart.save();
                }
                
            }
            
            return res.status(200).json({status:true,existingCart:existingCart});
            }
        }

    } 
    catch (error) {
         return res.status(500).json({status:false,message:error.message});
    } 
    
}
