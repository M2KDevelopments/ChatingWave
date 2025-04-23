const cors = require('cors')
const morgan = require('morgan');
const cookieParser = require("cookie-parser");
const express = require('express');
const path = require('path');
const database = require('./api/helpers/database.connection');
const app = express()
require('express-ws')(app);

// View Enging
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/api/views/'));

// middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// start database
database.startMongoDB(true);

//routes
app.all('/', (req, res) => res.status(200).send('Health Check Successful'));
app.use('/api/openai', require('./api/routes/openai'));

// 404 - errors
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});
// 500 - errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});


module.exports = app;