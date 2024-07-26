const schedule=require('node-schedule');
const Auction=require('../models/AuctionSchema');
const BusinessOwner=require('../models/BusinessOwnerRegistration');

const Business=require('../models/BusinessRegistrationSchema');

const User=require('../models/UserRegistrationSchema');

const rule=new schedule.RecurrenceRule();

rule.dayOfWeek=[0,new schedule.Range(0,6)];
rule.hour=23;
rule.minute=59;
rule.second=0;

//Update All
 
schedule.scheduleJob(rule,()=>{
    //update auctions
    Auction.updateMany({},{$set:{status:'Active'}},(err,res,req)=>{
        if(err){
            return res.status(500).json({message:err.message});
        }
        else{
            //update business owner's wallet
            //run a for loop to do something
            BusinessOwner.updateMany({},{$set:{wallet:0}},(err,res,req)=>{
                if(err){
                    return res.status(500).json({message:`Business Owner`})
                }
                else{

                }
            });
        }
        
    });

});

/**
 * Daily
 * 1. Check and Update auction status
 * 2. Deduct bids from owners
 * 3. Timer 
 */
