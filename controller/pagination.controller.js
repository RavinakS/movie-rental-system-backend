const { movies } = require('../model/movies.model');
const { users } = require('../model/user.model');

exports.pagination_for_movies = async (req, res) =>{
    const page = req.query._pageNum ? parseInt(req.query._pageNum) : 1;
    const limit = req.query._limit ? parseInt(req.query._limit) : 6;
    const skipIndex = (page - 1) * limit;
    const toDate = req.query._toDate ? req.query._toDate : "";
    const fromDate = req.query._fromDate ? req.query._fromDate : "";
    const searchTerm = req.query._search ? req.query._search : "";

    try {

        if(searchTerm && searchTerm.length > 0){
            if((toDate != "" || toDate != "undefined") && (fromDate != "" && fromDate != "undefined")){
                const results = await movies.find({$and: 
                    [
                        {name: 
                            {"$regex": searchTerm}}, 
                        {releasDate: 
                            {   $gte: new Date(fromDate).toISOString(),
                                $lt: new Date(toDate).toISOString()
                            }
                        }
                    ]
                }).sort({ releasDate: 'asc'})
                .skip(skipIndex)
                .limit(limit)
                .exec();

                const movies_count = results.length;
                return res.status(200).send({status_code: 200, movies: results, total_movies: movies_count});

            }else{
                const results = await movies.find({name: {"$regex": searchTerm}})
                .sort({ releasDate: 'asc'})
                .skip(skipIndex)
                .limit(limit)
                .exec();

                console.log(results);
                const movies_count = results.length;
                return res.status(200).send({status_code: 200, movies: results, total_movies: movies_count});
            
            }
        }
        else if((toDate === "" || toDate === "undefined") || (fromDate === "" || fromDate === "undefined")){
            const movies_count = await movies.count();

            const results = await 
            movies.find()
            .sort({ _id: 1})
            .skip(skipIndex)
            .limit(limit)
            .exec();
    
            return res.status(200).send({status_code: 200, movies: results, total_movies: movies_count});
        }
        else{
            const results = await movies.find({
                releasDate: {
                    $gte: new Date(fromDate).toISOString(),
                    $lt: new Date(toDate).toISOString()
                }
            })
                .sort({ releasDate: 'asc'})
                .skip(skipIndex)
                .limit(limit)
                .exec();

            const movies_count = results.length;
            return res.status(200).send({status_code: 200, movies: results, total_movies: movies_count});
        }  
    } 
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "Error Occured" });
    }
}

exports.pagination_for_users = async (req, res) => {
    const page = parseInt(req.query._pageNum);
    const limit = parseInt(req.query._limit);
    const skipIndex = (page - 1) * limit;
    const users_count = await users.count();

    try {
        const results = await users.find()
            .sort({ _id: 1 })
            .limit(limit)
            .skip(skipIndex)
            .exec();
        console.log('results: ', results);
        res.status(200).send({status_code: 200, users: results, total_users: users_count});  
    } 
    catch (e) {
        res.status(500).json({ message: "Error Occured" });
    }
}
