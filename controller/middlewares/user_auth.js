const {verifyToken} = require('../utils/token');
const {responses, error_messages} = require('../utils/constants');

exports.authentication = async function(req, res, next){
    try{
        token = req.headers.cookie.split("=")[1];
        console.log('token:: ', token);
        userInfo = await verifyToken(token);
        role = userInfo["role"].toLowerCase();
        if(role === 'admin'){
            next()
        }else{
            res.status(401).send(error_messages.un_authorized);
        }
    }catch(err){
        res.status(404).send(error_messages.login_page);
    }
}


exports.user_auth_for_movie = async function(req, res, next){
    try{
        token = req.headers.cookie.split("=")[1];
        userInfo = await verifyToken(token);

        role = userInfo["role"].toLowerCase();
        if(role === 'admin'){
            req.admin = req.query;
            next()
        }else{
            res.status(401).send(error_messages.un_authorized);
        }
    }catch(err){
        res.status(404).send(error_messages.login_page);
    }
}

exports.auth_for_rent = async function(req, res, next) {
    try{
        let token = req.headers.cookie.split('=')[1];
        userInfo = await verifyToken(token);
        if(userInfo==='err'){
            console.log('Token error');
            res.send({error: "Sorry! something is worng in our side", message:"we will get back to you soon."});
            return next();
        }
        req.user = userInfo;
        next()
    }catch(err){
        res.status(404).send('login');
        next();
    }
}

exports.auth_for_users = async function(req, res, next){
    try{
        let token = req.headers.cookie.split('=')[1];
        userInfo = await verifyToken(token);
        user_role = userInfo.role.toLowerCase();
        if(user_role === 'admin'){
            req.admin = true;
            return next()
        }
        req.admin = false;
        return next();
    }catch(err){
        console.log("token_not_found");
        res.send("token_not_found");
    }
}
