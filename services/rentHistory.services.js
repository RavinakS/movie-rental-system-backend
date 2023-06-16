const { rentHistory } = require('../model/rentHistory.model');
const { rents } = require('../model/rents.model');

exports.AddReturnMovie = (data) => {
    return rentHistory.create(data);
}

exports.removeUserRentedMovie = (m_name, user_id) => {
    return rents.deleteOne({ name: m_name, user: user_id });
}

exports.getMovieHistoryByName = (m_name) =>{
    return rentHistory.find({name: m_name});
}