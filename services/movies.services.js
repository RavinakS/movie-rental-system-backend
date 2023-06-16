const { movies } = require('../model/movies.model');
// const { rents } = require('../model/rents.model')

exports.allMovies = () =>{
    return movies.find();
}

exports.addMovie = (movieData) =>{
    return movies.create(movieData);
}

exports.searchMovie = async (identity) =>{
    return await movies.find({$or: [{ name: identity }, { genre: identity } ]})
}

exports.avalRentsMovieByName = (m_name) =>{
    return movies.findOne({name: m_name}, {avalCD:1});
}

exports.getMovieByName = (m_name) =>{
    return movies.findOne({name: m_name});
}

exports.updateMovie = async (m_name, m_details, rents) =>{
    await movies.updateOne({name: m_name}, {$inc: {avalCD: rents}});
    return await movies.updateOne({name: m_name}, {$set: m_details});
}

exports.deleteMovie = (m_name) =>{
    return movies.deleteOne({name: m_name});
}

exports.updateMovieRents = (m_name, inc_num) =>{
    return movies.updateOne({name: m_name}, {$inc: {avalCD: inc_num}});
}

exports.rentsDetails = (m_name) =>{
    return movies.aggregate([{
        $group: {
            from: "rents",
            localField: "name",
            foreignField: "name",
            as: "rentsDetail"
        }
    }])
}

exports.sortByReleasDate = () =>{
    return movies.find().sort({releasDate: 1});
}
