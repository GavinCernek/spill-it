
const express = require('express'); 
const mongoose = require('mongoose');
const router = express.Router();        // Initiates a Router to transfer routes to be handled by this file
const bcrypt = require('bcrypt');           // Require for BCrypt
const jwt = require('jsonwebtoken');        // Require for JSON Web Token
const checkAuth = require('../middleware/check-auth');     
const User = require('../models/user');
const Post = require('../models/post');

router.get('/', (req, res, next) => {       // GET Method to get all registered users 
    
    User.find()     // Find all users 
        .select('-__v')     
        .exec()     // Initiates a promise for asynchronous requests
        .then(docs => {     // If the response is complete,
            console.log(docs);      // Log the response to the terminal
            res.status(200).json({docs});   // Return a status of 200 and the response
        })
        .catch(err => {     // If there is an error, 
            console.log(err);       // Log the error
            res.status(500).json({error: err});     // Return a status of 500 and the error
        });
}); 

router.get('/current_user', checkAuth, (req, res, next) => {       // GET Method to get all registered users 

    const id = req.userData.userId;

    User.findById(id)       // Finds the user by their ID
        .select('username')     
        .exec()     // Initiates a promise for asynchronous requests 
        .then(docs => {           // If the response is complete,
            console.log(docs);      // Log the response to the terminal
            res.status(200).json({ docs });   // Return a status of 200 and the response
        })
        .catch(err => {         // If there is an error,
            console.log(err);       // Log the error
            res.status(500).json({ error: err });    // Return a status of 500 and the error
        });
}); 

router.get('/:userId', (req, res, next) => {        // GET Method to search for a specific user by ID

    const id = req.params.userId;       // Grabs the user's ID from the route
    let isAuth = false;

    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);     // Verifies that the JSON Web Token belongs to the user

        if (id === decoded.userId) {
            isAuth = true;
        };    
    };

    User.findById(id)       // Finds the user by their ID     
        .exec()     // Initiates a promise for asynchronous requests 
        .then(docs => {           // If the response is complete,
            console.log(docs);      // Log the response to the terminal
            res.status(200).json({ docs, isAuth: isAuth });   // Return a status of 200 and the response
        })
        .catch(err => {         // If there is an error,
            console.log(err);       // Log the error
            res.status(500).json({ error: err });    // Return a status of 500 and the error
        });
});

router.get('/:userId/written_posts', (req, res, next) => {

    const id = req.params.userId;

    Post.find({ authorId: id })
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json({ docs });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.get('/:userId/liked_posts', checkAuth, async (req, res, next) => {

    const id = req.params.userId;
    const user = await User.findById(req.userData.userId);

    if (user._id.equals(id)) {
        Post.find({ '_id': { $in: user.posts_liked } })
            .exec()
            .then(docs => {
                console.log(docs);
                res.status(200).json({ docs });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
    };
});

router.post('/signup', (req, res, next) => {        // POST Method for a user to signup for the website
    
    if (req.body.username.length < 5 || req.body.username.length > 30) {
        return res.status(409).json({ message: "Username must be within 5 to 30 characters long" });
    };

    if (req.body.password.length < 5) {
        return res.status(409).json({ message: "Password must be 5 characters or longer!" });
    };

    User.find({ $or: [{ email: req.body.email }, { username: req.body.username }] })    // Find a user who's email matches the email entered
        .exec()         // Initiates a promise for asynchronous requests
        .then(user => {         // If the response is ready,
            if (user.length >= 1) {         // If another user was found,
                return res.status(409).json({
                    message: "User with that email or username already exists"      // Return a status of 409 and a message
                });
            } else {                  // If no other user was found,
                bcrypt.hash(req.body.password, 10, (err, hash) => {     // Pass in the password to a hashing function
                    if (err) {      // If there was an error,
                        return res.status(500).json({ error: err });      // Return a status of 500 and the error
                    } else {                          // If there was no error,
                        const user = new User({         // Create a new User
                            _id: new mongoose.Types.ObjectId(),
                            username: req.body.username,        // Assign the user's data to the proper fields
                            email: req.body.email,
                            password: hash
                        });
            
                        user
                            .save()             // Save the user to the database
                            .then(result => {       // If the response is complete,
                                console.log(result);        // Log the result
                                res.status(201).json({
                                    message: 'User created'     // Return a status of 201 and a message
                                });
                            })
                            .catch(err => {         // If there was an error,
                                console.log(err);       // Log the error
                                res.status(500).json({ error: err });        // Return a status of 500 and a message
                            });
                    };
                });
            };
        });
});

router.post('/login', (req, res, next) => {     // POST Method to login a user 

    User.find({ email: req.body.email })     // Find a user with the email that matches the one entered
        .exec()             // Initiates a promise for asynchronous requests
        .then(user => {         // If the response is complete
            if (user.length < 1) {              // If no user is found,
                return res.status(401).json({
                    message: 'No account with entered email was found. Try signing up!'     // Return a status of 401 and a message
                });
            };
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {      // If a user is found, compare their password with the one entered
                if (err) {      // If the passwords do not match,
                    return res.status(401).json({
                        message: 'Error checking password'       // Return a status of 401 and a message
                    });
                };

                if (result) {          
                    const accessToken = jwt.sign(     // Create a JSON Web Token
                        { email: user[0].email, userId: user[0]._id }, 
                        process.env.JWT_KEY,   
                        { expiresIn: "15m" }
                    );

                    res.cookie('ichigo', 
                        jwt.sign(
                            { userId: user[0].id }, 
                            process.env.REFRESH_KEY, 
                            { expiresIn: '7d' }), 
                        { httpOnly: true }
                    );

                    return res.status(200).json({
                        message: 'Authorization successful',        // Return a status of 200 and a message as well as the token
                        accessToken: accessToken
                    });
                };

                res.status(401).json({      // If the login failed,
                    message: 'Invalid password. Please try again or signup!'     // Return a status of 401 and a message
                });
            });
        })
        .catch(err => {         // If there was an error,
            console.log(err);       // Log the error
            res.status(500).json({ error: err });     // Return a status of 500 and the error
        });
});

router.post('/logout', (req, res, next) => {

    res.cookie('ichigo', '', { httpOnly: true });
    
    return res.status(200).json({
        message: 'You logged out successfully'
    });
});

router.post('/refresh_token', async (req, res, next) => {

    const token = req.cookies.ichigo;

    if (!token) {
        return res.send({ ok: false, accessToken: '', message: 'No refresh token was detected' });
    };

    let refreshToken = null;

    try {
        refreshToken = jwt.verify(token, process.env.REFRESH_KEY);
    } catch (err) {
        console.log(err);
        return res.send({ ok: false, accessToken: '', message: 'Refresh token was invalid' });
    };

    const user = await User.findById(refreshToken.userId);

    if (!user) {
        return res.send({ ok: false, accessToken: '', message: 'User not found' });
    };

    const accessToken = jwt.sign(     // Create a JSON Web Token
        { email: user.email, userId: user._id }, 
        process.env.JWT_KEY,   
        { expiresIn: "15m" }
    );

    res.cookie('ichigo', 
        jwt.sign(
            { userId: user.id }, 
            process.env.REFRESH_KEY, 
            { expiresIn: '7d' }), 
        { httpOnly: true }
    );

    return res.status(200).send({ accessToken: accessToken });
});

router.delete('/:userId', checkAuth, (req, res, next) => {      // DELETE Method to delete a user

    const id = req.params.userId        // Grabs the user ID from the route

        // If the users ID's match,
    User.deleteOne({ _id: req.params.userId })         // Remove the user with the ID
        .exec()             // Initiates a promise for asynchronous requests
        .then(result => {           // If the response is complete,
            res.status(200).json({
                message: 'User was deleted'     // Return a status of 200 and a message
            });
        })
        .catch(err => {         // If there was an error,
            console.log(err);           // Log the error
            res.status(500).json({ error: err });     // Return a status of 500 and an error
        });
});

module.exports = router;        // Exports the Router to be used in other files