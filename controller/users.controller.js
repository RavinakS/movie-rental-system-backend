const { signUp, userDetailsById, profile, allUsersData, updateProfile, userProfileById, updateUserVallet } = require('../services/users.services');
const { createToken, verifyToken } = require('./utils/token');
const { error_messages, responses } = require('./utils/constants');
const { countRentsByUserID, totalRentsOfUser } = require('../services/rents.services');

exports.sign_up = async (req, res) =>{
    try{
        const userInfo = req.body;
        userInfo["password"] = req.hashPass;

        const signUpStatus = await signUp(userInfo);

        const tokenData = {
            email: userInfo.email,
            role: userInfo.role
        }

        const createdToken = await createToken(tokenData);
        
        res.cookie('token', createdToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 356
        });
        
        res.status(201).json(responses.succeeded);
        
    }catch(err){
        if(err.name === "MongoServerError" && err.code === 11000){
            return res.status(403).json(error_messages.al_exist);
        }
        
        res.send(err);
    }
}

exports.create_user = async (req, res) => {
    try{
        userInfo = req.body;
        userInfo["password"] = req.hashPass;

        signUpStatus = await signUp(userInfo);

        res.status(201).json(responses.succeeded);
    }catch(err){
        console.log(err);
        res.send(err);
    }
}

exports.login = async (req, res)=>{
    try{
        if(req.validPassword === "noUser"){
            return res.status(404).json(error_messages.not_exist);

        }else if(req.validPassword){
            userData = await userDetailsById(req.body.email);
            tokenData = {
                email: userData[0].email,
                role: userData[0].role
            }
            createdToken = await createToken(tokenData);
            res.cookie('token', createdToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 356
            });

            console.log("Logged is SuccessFully.");
            res.status(200).json(tokenData);
        }else{
            console.log(error_messages.wrong_pass);
            res.status(400).json(error_messages.wrong_pass);
        }

    }catch(err){
        res.send(err);
    }
    
}

exports.logout = async (req, res) => {
    try{
        let token = req.headers.cookie.split('=')[1];
        tokenLength = token.length;

        let check = token[tokenLength-3] + token[tokenLength-2] + token[tokenLength-1];
        if(check === '%7D'){
            res.cookie('token', '', { maxAge: 0, withCredentials: true });
            res.status(404).send("You are not looged in.")
            return;
        }
        userInfo = await verifyToken(token);
        res.cookie('token', '', { maxAge: 0, withCredentials: true });
        res.status(200).json("Bye Bye!!");

    }catch(err){
        console.log(err);
    }
}

exports.user_profile = async (req, res) =>{
    try{
        let token = req.headers.cookie.split('=')[1];
        tokenData = await verifyToken(token);

        userInfo = await profile(tokenData.email);
        // userRentsCount = await countRentsByUserID(tokenData.email);
        userRents = await totalRentsOfUser(tokenData.email);

        let view_profile = []
        if(userInfo.length > 0){
            view_profile.push(userInfo)
            view_profile.push(userRents)
            return res.status(200).json({view_profile});
        }else{
            res.status(404).json("no_user");
        }
        
    }catch(err){
        res.send(err);
    }
}

exports.allUsersInfo = async (req, res) =>{
    try{
        usersData = await allUsersData();
        res.status(200).json(usersData);
    }catch(err){
        res.send(err);
    }
}

exports.editProfile = async (req, res) =>{
    const { id } = req.query;
    const wallet = req.body.coins;
    try {
        if( wallet > 0){
            console.log('wallet: ', wallet);
            const updatedProfile = await updateProfile(id, req.body);
            res.status(201).send("Edited Successfully.");
        }else{
            res.status(304).send({status_code: 304, message: "Volet can't be Empty."});
        }
    } catch (error) {
        res.send(error);
    }
}

exports.userDetails = async (req, res) =>{
    const { id } = req.query;
    try {
        const details = await userProfileById(id);
        res.send(details);
    } catch (error) {
        res.send(error);
    }

}

exports.addToWallet = async (req, res) =>{
    const { amount, user } = req.query;
    const user_details = await userDetailsById(user);

    const newAmount = user_details[0].coins + parseInt(amount);
    
    console.log("newAmount", newAmount);
    
    const addNewAmount = await updateUserVallet(user, newAmount);
    res.status(200).send("Success");

}
