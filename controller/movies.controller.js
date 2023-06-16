const { allMovies, addMovie, searchMovie, updateMovie, deleteMovie, getMovieByName, rentsDetails, sortByReleasDate, avalRentsMovieByName, updateMovieRents } = require('../services/movies.services');
const { responses, error_messages } = require('../controller/utils/constants');
const { findRentsByMovieName } = require('../services/rents.services');
const { movies } = require('../model/movies.model');

exports.search_movie = async (req, res) =>{
    data = req.query;
    for(let key in data){
        search_data = data[key];
        if(search_data !== undefined){
            try{
                var movies = await searchMovie(search_data);
                res.send(movies);
            }catch(err){
                return res.send(err);
            }
        }
    }
    size = Object.keys(req.query).length;
    if(size === 0){
        res.status(400).send(error_messages.required);
    }else if(not_found > 0){
        res.status(404).send(error_messages.not_exist);
    }
}


exports.all_movies = async (req, res) =>{
    try{
        const movies = await allMovies();
        if(movies.length <= 0){
            return res.status(204).send("noMovies");
        }

        res.status(200).send({status_code: 200, data: movies});
    }catch(err){
        console.log(err);
    }
}


exports.add_movie = async (req, res) =>{
    movieDetails = req.body;
    const image = req.file;

    if (!image) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      console.log(error);
      return res.send(error);
    }

    movieDetails['image'] = image.path;
    
    try{
        added = await addMovie(movieDetails);
        res.status(201).send(responses.succeeded);
    }catch(err){
        console.log(err);
        return res.send(err);
    }

}

exports.update_movie = async (req, res) =>{
    try{ 
        const image = req.file;

        let {old_name, name, releasDate, genre, avalCD, coins} = req.body;

        movieDetails = await getMovieByName(old_name);

        if(movieDetails===null){
            return res.status(404).json({status_code: 404, message: "Couldn't find the movie."})
        }
        
        let rents = movieDetails.avalCD;
        let newRents = parseInt(avalCD);
        if(newRents >= rents){
            if(coins < 0){
                return res.status(408).send({status_code: 408, message: `Price can't be a negative number.`});
            }

            let updates;

            if(!image){
                updates = {
                    _id: req.body._id,
                    name: name,
                    releasDate: releasDate, 
                    genre: genre,
                    coins: coins
                }
            }else{
                updates = {
                    _id: req.body._id,
                    name: name,
                    releasDate: releasDate, 
                    genre: genre,
                    coins: coins,
                    image: image.path
                }
            }

            const addRents = newRents - rents;
            let update = await updateMovie(old_name, updates, addRents);
            
            res.status(201).send({status_code: 200, message: "Updated Successfully."});
        }else{
            res.status(408).send({status_code: 408, message: `available CDs should be >= ${rents}`});
        }
    }catch(err){
        console.log(err);
        res.send(err);
    }

}

exports.delete_movie = async (req, res) =>{
    try{
        const movieName = req.params.name;
        const movieRents = await findRentsByMovieName(movieName);
        if(movieRents.length != 0){
            const total_rents = await avalRentsMovieByName(movieName);
            if(total_rents != 0){
                const rents = -1 * total_rents.avalCD;
                const updateRents = await updateMovieRents(movieName, rents);
                return res.status(205).send({status_code: 205, totalRents: total_rents});
            }
            return res.status(202).send({status_code: 202, totalRents: total_rents});
        }

        const delete_movie = await deleteMovie(movieName);

        if(delete_movie.deletedCount === 0){
            return res.status(404).send({status_code: 404, message: "Couldn't find the movie."});
        }
        res.status(201).send({status_code: 201, message: "Have Successfully Deleted the Movie"});

    }catch(err){
        console.log(err);
        res.send(err)
    }
}

exports.sort_movies = async (req, res) => {
    try{
        const movies = await sortByReleasDate();
        res.status(200).send(movies);
    }catch(err){
        console.log(err);
        res.send(err);
    }
}

exports.movieByName = async (req, res) => {
    try{
        m_name = req.params.name
        const m_details = await getMovieByName(m_name);
        res.status(200).json(m_details);
    }catch(err){
        console.log(err);
        res.send(err);
    }
} 
