const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyPasser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect('mongodb+srv://htbUser:htbPassword@htbcluster.k0m6z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
        useNewUrlParser: true
    }
);

const submissionRouter = require('./api/routers/submission');


app.use(morgan('dev'));
app.use(bodyPasser.urlencoded({extended: false}));
app.use(bodyPasser.json());


app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Token');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/submissions', submissionRouter);


module.exports = app;