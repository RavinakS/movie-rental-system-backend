const express = require('express');
const router = express.Router();
const { pagination_for_movies, pagination_for_users } = require('../controller/pagination.controller');
const { authentication } = require('../controller/middlewares/user_auth');

router.get('/movie-page', pagination_for_movies);

router.get('/users-page', authentication, pagination_for_users);



module.exports = router;