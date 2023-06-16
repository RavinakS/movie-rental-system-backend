const bcrypt = require('bcrypt');
const {userDetailsById} = require('../../services/users.services');

exports.hashPass = async (req, res, next) =>{
    try{
        userPass = req.body.password;
        salt = await bcrypt.genSalt();
        hashpassw = await bcrypt.hash(userPass, salt);
        req.hashPass = hashpassw;
        next();

    }catch(err){
        res.send(err);
        next()
    }
}

exports.comparePass = async (req, res, next) =>{
    try{
        userInfo = await userDetailsById(req.body.email);
        dbPassword = userInfo[0].password;
        isPasswordValid = await bcrypt.compare(req.body.password, dbPassword);
        req.validPassword = isPasswordValid;
        next();
    }catch(err){
        req.validPassword = 'noUser';
        next()
    }
}

