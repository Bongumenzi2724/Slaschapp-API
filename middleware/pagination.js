function paginated(model){
    return async(req,res,next)=>{
        const page=req.query.start||0;
        const limit=req.query.limit;
        const startIndex=parseInt((page-1)*limit);
        const endIndex=parseInt(page*limit);
        let results={};
        if(endIndex<(await model.countDocuments().exec())){
             results.next={
             pages:page+1,
            limit:limit
            }
            }
        if(startIndex>0){
            results.previous={
            pages:page-1,
            limit:limit
            }
        }
        try {
            results.results=await model.find().limit(limit).skip(startIndex).exec();
            res.paginatedResults=results;
            next();
        } catch (error) {
            return res.status(500).json({message:error.message})
        }
        results.results=model.slice(startIndex,endIndex);
        res.paginatedResults=results;
        next();
        }
}
module.exports=paginated