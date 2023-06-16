const { AddReturnMovie, removeUserRentedMovie, getMovieHistoryByName } = require('../services/rentHistory.services');
const { userDetailsById, updateUserRent, updateUserVallet } = require('../services/users.services');
const { findRentsByUserID, totalRentsOfUser } = require('../services/rents.services'); 
const { updateMovieRents } = require('../services/movies.services');

exports.returnMovie = async (req, res) =>{
    const m_details = req.body;
    const fee = 15;
    const firstDate = new Date(m_details.rentDate);
    const secondDate = new Date(m_details.returnDate);
    const timeDifference = Math.floor(secondDate.getTime() - firstDate.getTime());

    let differentDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if(differentDays > 1){
        console.log("differentDays", differentDays);
        const additional_amount = (differentDays-1) * fee;

        const user_details = await userDetailsById(m_details.user);


        if(user_details[0].coins < additional_amount){
            return res.send({message: 'addAmount', additional_amount: additional_amount, wallet:user_details[0].coins});
        }

        try{
            const added = await AddReturnMovie(m_details);
    
            const removeMovie = await removeUserRentedMovie(m_details.name, m_details.user);
    

            const lefted_rents = await totalRentsOfUser(m_details.user);
    
            const avalMovieRents = await updateMovieRents(m_details.name, 1);

            const vallet = user_details[0].coins - additional_amount;

            updateUserRentStatus = await updateUserRent(m_details.user, lefted_rents.length);

            decAdditionalAmount = await updateUserVallet(m_details.user, vallet);
    
            res.status(200).send({message: 'success', deducted_amount: additional_amount});
            
        }catch(err){
            console.log(err);
            res.send(err)
        }
    }
    else{
        console.log("No delay.");
        try{
            const added = await AddReturnMovie(m_details);
    
            const removeMovie = await removeUserRentedMovie(m_details.name, m_details.user);
    
            const user_details = await userDetailsById(m_details.user);
            
            const lefted_rents = await totalRentsOfUser(m_details.user);

            const avalMovieRents = await updateMovieRents(m_details.name, 1);
    
            updateUserRentStatus = await updateUserRent(m_details.user, lefted_rents.length);
    
            res.status(200).send({message: 'failed', deducted_amount: 0});
            
        }catch(err){
            console.log(err);
            res.send(err)
        }
    }
}

exports.getMovieHistory = async (req, res) => {
    const { m_name } = req.query;

    try{
        const movieHistoryDetails = await getMovieHistoryByName(m_name);

        if(movieHistoryDetails.length > 0){
            res.status(200).send(movieHistoryDetails);
        }else{
            res.status(204).send("noHistory");
        }
    }catch(err){
        console.log(err);
        res.send(err)
    }
}

exports.fetchMovie = async (req, res) =>{
    const m_details = req.body;
    
    try{
        const added = await AddReturnMovie(m_details);

        const removeMovie = await removeUserRentedMovie(m_details.name, m_details.user);

        const lefted_rents = await totalRentsOfUser(m_details.user);

        const avalMovieRents = await updateMovieRents(m_details.name, 1);

        updateUserRentStatus = await updateUserRent(m_details.user, lefted_rents.length);

        res.status(200).send({message: 'success'});
        
    }catch(err){
        console.log(err);
        res.send(err)
    }
}
