const { rents } = require('../model/rents.model');

exports.addRent = (movie_rent_data) =>{
    return rents.create(movie_rent_data);
}

exports.findRentsByMovieName = (m_name) =>{
    return rents.find({name: m_name}).populate('user_id').populate('movie_id');
}

exports.countRentsByUserID = (user_email) =>{
    return rents.count({user: user_email});
}

exports.totalRentsOfUser = (user_email) =>{
    return rents.find({user: user_email});
}

exports.findRentsByUserID = async (user_email, limit, skipIndex, toDate, fromDate, searchTerm) =>{
    if(searchTerm && searchTerm.length > 0){
        if((toDate != "" || toDate != "undefined") && (fromDate != "" && fromDate != "undefined")){
            const results = await rents.find({$and: 
                [
                    {user: user_email},
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

            const movies_count = await rents.count({user: user_email});

            return {status_code: 200, movies: results, total_movies: movies_count};

        }else{
            const results = await rents.find({$and:
                [
                    {user: user_email}, 
                    {name: 
                        {"$regex": searchTerm}
                    }
                ]
            })
            .sort({ releasDate: 'asc'})
            .skip(skipIndex)
            .limit(limit)
            .exec();

            const movies_count = await rents.count({user: user_email});
            
            return {status_code: 200, movies: results, total_movies: movies_count};
        
        }
    }
    else if((toDate === "" || toDate === "undefined") || (fromDate === "" || fromDate === "undefined")){

        const results = await rents.find({user: user_email})
            .sort({ _id: 1})
            .skip(skipIndex)
            .limit(limit)
            .exec();

        const movies_count = await rents.count({user: user_email});

        return {status_code: 200, movies: results, total_movies: movies_count};
    }
    else{
        const movies_count = await rents.count({user: user_email});

        const results = await rents.find({ $and: 
            [
                {user: user_email},
                {releasDate: 
                    {
                        $gte: new Date(fromDate).toISOString(),
                        $lt: new Date(toDate).toISOString()
                    }
                }
            ]
        })
        .sort({ releasDate: 'asc'})
        .skip(skipIndex)
        .limit(limit)
        .exec();

        return {status_code: 200, movies: results, total_movies: movies_count};
    } 
}

