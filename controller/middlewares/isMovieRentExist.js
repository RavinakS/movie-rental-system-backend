const {findRentsByMovieName} = require('../../services/rents.services');
const {error_messages, responses} = require('../utils/constants');
const { avalRentsMovieByName } = require('../../services/movies.services');

exports.isMovieRentExist = async (req, res, next) =>{
    let {m_name} = req.query;
    let user_id = req.user.email;

    if(m_name === undefined){
        return res.status(400).send(error_messages.required);
    }

    // is movie available
    let availableRents = await avalRentsMovieByName(m_name);
    if(availableRents === null || availableRents <= 0){
        return res.status(503).send({ message: "notAval"});
    } 

    try{ 

        // get all rents for this movie
        findRentsByMname = await findRentsByMovieName(m_name);
        all_rents = findRentsByMname;

        // checking if the user already have taken this movie rent
        if(findRentsByMname.length === 0){
            req.movieRentExist = false;
            return next();
        }

        check = 0;
        for(let rent of all_rents){
            if(rent.user === user_id){
                req.movieRentExist = true;
                return res.status(403).send("taken");
            }
            check = check + 1
        }
        if(check === all_rents.length){
            req.movieRentExist = false;
            return next();
        }

    }catch(err){
        console.log(err);
        res.send(err);
    }
}
