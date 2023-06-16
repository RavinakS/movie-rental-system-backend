const express = require('express');
const router = express.Router();
const {buyMovie, viewUserRents, viewMovieRents, userTotalRents} = require('../controller/rents.controller');
const {auth_for_rent, auth_for_users} = require('../controller/middlewares/user_auth');
const {isMovieRentExist} = require('../controller/middlewares/isMovieRentExist');

// buy a movie
router.post('/rent-movie', auth_for_rent, isMovieRentExist, buyMovie);

// view rent details of a particuler user, only admin can seer user rents
router.get('/user-rent', auth_for_users, viewUserRents);

// view rent details of a particular movie
router.get('/movie-rents/:name', viewMovieRents);

// total rents of a user, user can see it's own rents
router.get('/total-rents', userTotalRents);

module.exports = router;