const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const todoHandler = require('./routeHandler/todoHandler');
const userHandler = require('./routeHandler/userHandler');

const app = express();
dotenv.config();
app.use(express.json());

//Database connection with mongoose....
mongoose.connect('mongodb://localhost:27017/todo')
    .then( () => {
        console.log('Databse Connection Seccessfully!!!');
    })
    .catch( (err) => {
        console.log(err);
    })


//application route....................
app.use('/todo', todoHandler);
app.use('/user', userHandler);

//default error handler................
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }
    res.status(500).json({ error: err });
}

app.use(errorHandler);

//Start the server......................
app.listen(3000, () => {
    console.log("Listen on port 3000");
})