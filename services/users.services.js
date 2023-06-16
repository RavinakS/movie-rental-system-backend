const { users } = require('../model/user.model');

exports.signUp = (userData) =>{
    return users.create(userData);
}

exports.userDetailsById = (user_id) =>{
    return users.find({email: user_id}, {email:1, password:1, role:1, rent:1, _id:1, coins:1});
}

exports.profile = (user_id) =>{
    return users.find({email: user_id}, {name:1, email:1, rent:1, role:1, _id:1, coins:1});
}

exports.updateUserRent = (user, rents) =>{
    return users.updateOne({email:user}, {rent: rents});
}

exports.allUsersData = () =>{
    return users.find({}, {__v:0, password:0});
}

exports.decUserCoins = (user, price) =>{
    return users.updateOne({email:user}, {$inc: {coins: -price}})
}

exports.updateUserVallet = (user, total_coins) =>{
    return users.updateOne({email:user}, {coins: total_coins});
}

exports.updateProfile = (user_id, updateDetails) =>{
    console.log("updateDetails....", updateDetails);
    return users.updateOne({_id: user_id}, updateDetails);
}

exports.userProfileById = (user_id) =>{
    return users.findOne({_id: user_id});
}
