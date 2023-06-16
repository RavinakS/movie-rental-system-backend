const { get_token } = require('../controller/auth')

const express = require('express');
const router = express.Router();

router.post('/get-token', get_token);

module.exports = router;