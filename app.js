
const express = require('express');     // npm packages required for app
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const userRoutes = require('./api/routes/user');        // Routes being stored in variables to shorten them
const postsRoutes = require('./api/routes/posts');
const searchRoutes = require('./api/routes/search');

mongoose.connect(
    process.env.MONGO_ATLAS_CONNECTION, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true,               // MongoDB configurations
        useCreateIndex: true
    }
);

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());   

app.use('/user', userRoutes);
app.use('/posts', postsRoutes);                 // Any requests using these routes are sent to ./api/routes/... 
app.use('/search', searchRoutes);

app.use(express.static('client/build'));        // Setting up a static express server for our client

app.get('/*', (req, res, next) => {
   res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

module.exports = app;