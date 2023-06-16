const { userDetailsById, signUp } = require('../services/users.services');
const {createToken, verifyToken} = require('./utils/token');

exports.googleLogin = async (req, res)=>{
    try{

        const user_info = req.user._json;
        // res.redirect('http://localhost:3006/'); /google-auth-login
        
        const userData = await userDetailsById(user_info.email);
        
        if(userData.length != 0 ){
            const tokenData = {
                id: userData[0]._id,
                email: userData[0].email,
                role: userData[0].role
            }

            const createdToken = await createToken(tokenData);

            res.cookie('token', createdToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 356
            });

            console.log("Logged in SuccessFully.");
            res.redirect('http://localhost:3006/google-auth-login');
            
        }else{
            const userInfo = {
                googleID: user_info.sub,
                name: user_info.name,
                email: user_info.email,
                password: "password",
                role: 'User'
            } 

            try{
                signUpStatus = await signUp(userInfo);
        
                tokenData = {
                    id: user_info.sub,
                    email: userInfo.email,
                    role: userInfo.role
                }
        
                createdToken = await createToken(tokenData);
                
                res.cookie('token', createdToken, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 356
                });
                
                console.log("Signed up SuccessFully.");
                res.redirect('http://localhost:3006/google-auth-login')
                
            }catch(err){
                console.log(err);
                res.send(err);
            }
        }
    }catch(err){
        console.log(err);
        res.send(err);
    }
    
}

exports.auth_google_login_user = async (req, res) => {
    try{
        let token = req.headers.cookie.split('=')[1];
        console.log("token>>>>>", token);

        const userInfo = await verifyToken(token);

        res.status(201).send({email: userInfo.email, role: userInfo.role });
    }catch(err){
        console.log("token_not_found");
        res.send("token_not_found");
    }
}