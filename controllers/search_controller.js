const User=require('../models/UserRegistrationSchema')
const BusinessOwnerRegistration = require("../models/BusinessOwnerRegistration");
const Bait = require('../models/BaitSchema');
const Business=require('../models/BusinessRegistrationSchema');
const Categories = require("../models/Categories");
const Auction=require('../models/AuctionSchema')

const search_controller=async(req,res)=>{
    const query=req.query.query;
    const page=parseInt(req.query.page)||1;
    const limit=10;
    const sort=req.query.sort||'firstname';
    const results=await SearchResults(query,page,limit,sort);
    if(!results){
        return res.status(404).json({message:"No Search Result(s) Found"})
    }
    return res.status(200).json({message:"Search Results",results:results});
}

async function SearchResults(query,page,limit,sort){
    const results=[];
    const pipeline=[
        {
            $match:{
                $or:[
                    {description:{$regex:query,options:'i'}},
                    {BusinessName:{$regex:query,options:'i'}},
                    {BusinessCategory:{$regex:query,options:'i'}},
                    {BusinessLocation:{$regex:query,options:'i'}},
                    {firstname:{$regex:query,options:'i'}},
                    {secondname:{$regex:query,options:'i'}},
                    {surname:{$regex:query,options:'i'}},
                    {locationOrAddress:{$regex:query,options:'i'}},
                    {gender:{$regex:query,options:'i'}},
                    {categoryName:{$regex:query,options:'i'}},
                    {baitPlantName:{$regex:query,options:'i'}},
                    {campaignName:{$regex:query,options:'i'}},
                    {campaignBudget:{$regex:query,options:'i'}},
                    {campaignStartDate:{$regex:query,options:'i'}},
                    {campaignDailyBudget:{$regex:query,options:'i'}},
                    {baitPlantDescription:{$regex:query,options:'i'}},
                    {$text:{$search:query}}
                ]
            }
        },
        {
            $sort:{
                [sort]:1
            }
        },
        {
            $skip:(page-1)*limit
        },
        {
            $limit:limit
        }
    ];
    //Search User Collection
    const users=await User.aggregate(pipeline);
    results.push(...users.map(user => ({ type: 'user', data: user })));
    //Search Business Owner Collection
    const owner=await BusinessOwnerRegistration.aggregate(pipeline);
    results.push(...owner.map(owner => ({ type: 'owner', data: owner })));
    //Search Business Collection
    const businesses=await Business.aggregate(pipeline);
    results.push(...businesses.map(business => ({ type: 'business', data: business })));
    //Search Categories Collection
    const categories=await Categories.aggregate(pipeline);
    results.push(...categories.map(category => ({ type: 'category', data: category })));
    //Search Bait Plants Collection
    const baitPlants=await Bait.aggregate(pipeline);
    results.push(...baitPlants.map(baitPlant => ({ type: 'baitPlant', data: baitPlant })));
    //Search Auctions Collection
    const auctions=await Auction.aggregate(pipeline);
    results.push(...auctions.map(auction => ({ type: 'baitPlant', data: auction })));
    return results

}

module.exports={search_controller}