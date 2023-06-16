const { returnMovie, getMovieHistory, fetchMovie } = require('../controller/rentHistory.controller');
const { returnMovieValidation, fetchMovieValidation } = require('../controller/utils/schemaValidation');
const { user_auth_for_movie } = require('../controller/middlewares/user_auth');

const express = require('express');
const router = express.Router();

router.post('/return-movie', returnMovieValidation, returnMovie);

router.post('/fetch-movie', fetchMovieValidation, fetchMovie);

router.get('/movie-history', user_auth_for_movie, getMovieHistory);

module.exports = router;