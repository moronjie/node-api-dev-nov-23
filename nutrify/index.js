require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connect = require('./models/createDb');
const cors = require('cors');
const {errorMiddleware} = require('./middleware/errorMiddleware');


//routers
const user = require('./router/user');

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());


//routes
app.use('/user', user);

app.use(errorMiddleware);

// database connection 
connect(process.env.DB);

mongoose.connection.on('error', () => {console.log("something is wrong. Check your internet connection");})

mongoose.connection.once('open', () => {
    app.listen(port, () => { console.log(`Database connection successfull`)})
})





