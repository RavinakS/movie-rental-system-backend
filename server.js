require('dotenv').config();
// require('./model/dbConnection.model');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');

const express = require('express');
const app = express();

app.use(cookieParser());

const cors = require('cors');
app.use(cors());

const logger = require('morgan');
app.use(logger('dev'));

app.use(express.json())

app.use('/uploads', express.static(__dirname + '/uploads'))

const users = require('./routes/users.routes');
app.use('/', users);

const googleLogin = require('./routes/googleLogin.routes');
app.use('/', googleLogin)

const movies = require('./routes/movies.routes');
app.use('/', movies);

const rents = require('./routes/rents.routes');
app.use('/', rents);

const pagination = require('./routes/pagination.routes');
app.use('/', pagination);

const auth = require('./routes/auth');
app.use('/', auth);

const rentHistory = require('./routes/rentHistory.routes');
app.use('/', rentHistory);

let swaggerDocument = JSON.parse(fs.readFileSync(`./swagger.json`, 'utf-8'));

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3040, '127.0.0.1', (req, res)=>{
    console.log("3040 Server is on..");
})
