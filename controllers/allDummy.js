/*
console.log(newCart);
        if(!newCart){
            let baitArray=[];
            let auctionArray=[];
            let expiryDate=new Date();
            baitArray.push({baitId:baitId,baitName:bait.baitPlantName,totalPrice:bait.price*quantity,quantity:quantity,size:bait.size,color:bait.color});
            auctionArray.push({auctionID:auctionId,auctionName:auctionName});

            const newCartItem=new Cart({
                Auctions:auctionArray,
                totalCartPrice:quantity*bait.price,
                totalCartQuantity:quantity,
                baits:baitArray,
                status:status,
                code:code,
                paymentMethod:paymentMethod,
                expiryDate:expiryDate.setTime(expiryDate.getTime()+(30*24*60*60*100))
            });
            return res.status(200).json({status:true,cart:newCartItem})
        } 
        else{
            //populate the auction array
            existingCart.Auctions.push({auctionID:auctionID,auctionName:auction.campaignName});
            //eliminate duplicate auctions
            existingCart.Auctions=[...new Set(existingCart.Auctions.map(JSON.stringify))].map(JSON.parse);
            
            if(existingCart.baits.length===1 && existingCart.baits[0].baitID==baitId){
                existingCart.baits[0].quantity=existingCart.baits[0].quantity+req.body.quantity;

                existingCart.baits[0].totalBaitPrice=bait.price*existingCart.baits[0].quantity;

                updates={existingCart.baits[0].quantity:existingCart.baits[0].quantity,existingCart.baits[0].totalPrice}
                //Update the document here
                await Cart.findByIdAndUpdate(existingCart._id,updates,{new:true});
                await existingCart.save();
                return res.status(200).json({status:true,existingCart:existingCart});
            }
            else{
                //look for the correct bait to update the quantity and bait plant price
                let price;
                let quantity2;
                let k;

                for(let j=0;j<=existingCart.baits.length-1;j++){
                    for(let i=0;i<=existingCart.baits.length-1;i++){
                        //push the new bait at the end of the baits array
                        if(i==existingCart.baits.length-1 && existingCart.baits[existingCart.baits.length-1].baitID !=req.params.baitID){
                            //push the new bait at the end of the baits array
                            existingCart.baits.push({baitID:req.params.baitID,baitName:bait.baitPlantName,totalBaitPrice:bait.price*req.body.quantity,quantity:req.body.quantity,size:bait.size,color:bait.color});
                        }
                    }
                    if(existingCart.baits[j].baitID==baitId){
                        //console.log(`BaitID ${j}," ", ${existingCart.baits[j].baitID}`)
                        console.log("New Update");
                        k=j;
                        //console.log(existingCart.baits[j].baitID,"baitID",req.params.baitID)
                        quantity2=existingCart.baits[j].quantity+req.body.quantity;
                        console.log(`new bait Quantity ${quantity2}`);

                        console.log(`existing cart bait price ${existingCart.baits[j].totalBaitPrice}`)

                        price=bait.price*(existingCart.baits[j].quantity+req.body.quantity);

                        console.log(`new bait total price ${price}`);

                        //Update the document here
                        //Saving Cart Update

                    }
                }
                //update baits quantity
                existingCart.baits[k].quantity=quantity2
                //update baits price
                existingCart.baits[k].totalPrice=price;

                //total cart price accumulator
                let sum=0;
                //total quantity accummulator for the cart
                let baitQuantity=0 
                for(let i=o;i<=existingCart.baits.length-1;i++){
                    sum+=existingCart.baits[i].quantity;
                    baitQuantity+=existingCart.baits[i].totalPrice;
                }

                //Set the total cart price and quantity to sum and baitQuantity
                existingCart.totalCartPrice=sum;
                existingCart.totalCartQuantity=baitQuantity;
                 newcart=await Cart.findByIdAndUpdate({_id:existingCart._id},{existingCart},{new:true})
                //Update the values in the mongodb database
                existingCart.save();
                return res.status(200).json({cart:newcart});
            }
        } 

*/