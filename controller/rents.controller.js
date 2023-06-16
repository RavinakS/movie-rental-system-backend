const { getMovieByName, updateMovieRents} = require('../services/movies.services');
const {userDetailsById, updateUserRent, decUserCoins} = require('../services/users.services');
const {addRent, findRentsByUserID, findRentsByMovieName, totalRentsOfUser } = require('../services/rents.services');
const {error_messages, responses} = require('./utils/constants');
const { verifyToken } = require('./utils/token');


// Buy a movie
exports.buyMovie = async (req, res) =>{
    let {m_name, rent_date} = req.query;
    let auth_data = req.user;

    try{
        movie_details = await getMovieByName(m_name);
        user_details = await userDetailsById(auth_data.email);

        if(movie_details === null){
            return res.status(404).send(error_messages.not_exist);
        }if(movie_details.avalCD <= 0){
            return res.status(408).send({status_code: 408, message: "Out of Stock."});
        }

        const moviePrice = movie_details.coins;
        const userWallet = user_details[0].coins;
        
        if(moviePrice > userWallet){
            return res.json({message: 'addAmount', additional_amount: moviePrice-userWallet, wallet: userWallet, user: auth_data.email });
        }
        
        let rent_details = {
            user_id: user_details[0]._id,
            user: auth_data.email,
            name: movie_details.name,
            releasDate: movie_details.releasDate,
            genre: movie_details.genre,
            movie_id: movie_details._id,
            rentDate: rent_date,
            image: movie_details.image 
        };


        added = await addRent(rent_details);


        // update the rent field of the user to +1
        total_rents = user_details[0].rent + 1;
        const updateUserRentStatus = await updateUserRent(auth_data.email, total_rents);

        // deduct from wallet
        const decreaseUserCoins = await decUserCoins(auth_data.email, moviePrice);

        // update available CDs
        const update_movie_rents = await updateMovieRents(movie_details.name, -1)

        return res.status(200).send(responses.succeeded);
    }
    catch(err){
        console.log(err);
        res.send(err);
    }
}

// view a particular user's rents details
exports.viewUserRents = async (req, res) =>{
    user_id = req.body.email;
    const { email } = req.query;
    if(email != undefined){
        if(!req.admin){
            return res.status(401).send(error_messages.un_authorized);
        }
        getUserDetails = await userDetailsById(email); 
        if(getUserDetails.length === 0){
            return res.status(404).send(error_messages.not_exist);
        }else if(getUserDetails[0].rent === 0){
            return res.status(200).send({status_code: 200, rents: 0})
        }
        all_rents = await totalRentsOfUser(email);
        return res.status(200).send({status_code: 200, No_of_rents: `${all_rents.length}`, rents: all_rents});
    }
    else if(user_id === undefined){
        return res.status(400).send(error_messages.required);
    }
    try{
        if(!req.admin){
            return res.status(401).send(error_messages.un_authorized);
        }
        getUserDetails = await userDetailsById(user_id); 
        if(getUserDetails.length === 0){
            return res.status(404).send(error_messages.not_exist);
        }else if(getUserDetails[0].rent === 0){
            return res.status(200).send({status_code: 200, rents: "0 rents."})
        }
        all_rents = await totalRentsOfUser(user_id);
        res.status(200).send({status_code: 200, No_of_rents: `${all_rents.length}`, rents: all_rents});
    }catch(err){
        console.log(err);
        res.send(err);
    }
}

exports.viewMovieRents = async (req, res) =>{
    try{
        let movie_name = req.params.name;
        let getRentsDetails = await findRentsByMovieName(movie_name);        
        if(getRentsDetails.length === 0){
            res.status(404).send({status_code: 404, message: "No Rents"});
        }else{
            console.log(getRentsDetails);
            return res.status(200).send(getRentsDetails);
        }
    }catch(err){
        console.log(err);
        res.send(err);
    }
}

exports.userTotalRents = async (req, res) =>{
    let token = req.headers.cookie.split('=')[1];
    tokenData = await verifyToken(token);

    const page = req.query._pageNum ? parseInt(req.query._pageNum) : 1;
    const limit = req.query._limit ? parseInt(req.query._limit) : 6;
    const skipIndex = (page - 1) * limit;
    const toDate = req.query._toDate ? req.query._toDate : "";
    const fromDate = req.query._fromDate ? req.query._fromDate : "";
    const searchTerm = req.query._search ? req.query._search : "";

    try{
        const userRents = await findRentsByUserID(tokenData.email, limit, skipIndex, toDate, fromDate, searchTerm);
        console.log("userRents", userRents);
    
        return res.status(200).send(userRents);

    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Error Occured" });
    }
}