const jwt = require('jsonwebtoken');
const key = process.env.SECRET_KEY;

exports.createToken = async (data) =>{
    try{
        token = await jwt.sign(data, key);
        return token;
    }catch(err){
        console.log(err);
        return false;
    }
}

exports.verifyToken = async (token) =>{
    try{
        userData = await jwt.verify(token, key);
        return userData;
    }catch(err){
        return "err";
    }
}
