const express = require('express');
const router = express.Router();

const {sign_up, login, user_profile, allUsersInfo, logout, create_user, editProfile, userDetails, addToWallet } = require('../controller/users.controller');
const {hashPass, comparePass} = require('../controller/middlewares/password');
const { authentication } = require('../controller/middlewares/user_auth');
const { userValidation } = require('../controller/utils/schemaValidation')

router.post('/create-account', userValidation, hashPass, sign_up);

router.post('/create-user', userValidation, hashPass, create_user);

router.post('/login', comparePass, login);

router.get('/view-profile', user_profile);

router.put('/edit-profie', editProfile);

router.get('/user-details', userDetails);

// router.get('/view-users-data', auth_for_users, allUsersInfo);
router.get('/view-users-data', authentication, allUsersInfo);

router.get('/logout', logout);

router.put('/add-to-wallet', addToWallet);

module.exports = router;