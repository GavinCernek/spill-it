
// Written by: Gavin Cernek, 1/21/2021

const express = require('express');         // npm packages required for app
const mongoose = require('mongoose');
const router = express.Router();     
const bcrypt = require('bcrypt');           
const jwt = require('jsonwebtoken');        
const checkAuth = require('../middleware/check-auth');   

const User = require('../models/user');         // Mongoose schemas
const Post = require('../models/post');

router.get('/', (req, res, next) => {       // GET function to get all registered users 
    
    User.find()     // Find all users 
        .select('-__v')     
        .exec()     // Initiates a promise for asynchronous requests
        .then(docs => {     // If the response is complete,
            console.log(docs);     
            res.status(200).json({docs});   // Return a status of 200 and the response
        })
        .catch(err => {     // If there is an error, 
            console.log(err);      
            res.status(500).json({error: err});     // Return a status of 500 and the error
        });
}); 

router.get('/current_user', checkAuth, (req, res, next) => {       // GET function to get the user who is currently logged in

    const id = req.userData.userId;         // Grabs the user's id from the access token

    User.findById(id)       // Finds the user by their id
        .select('username')     
        .exec()     // Initiates a promise for asynchronous requests 
        .then(docs => {           // If the response is complete,
            console.log(docs);     
            res.status(200).json({ docs });   // Return a status of 200 and the response
        })
        .catch(err => {         // If there is an error,
            console.log(err);      
            res.status(500).json({ error: err });    // Return a status of 500 and the error
        });
}); 

router.get('/:userId', (req, res, next) => {        // GET function to search for a specific user by id

    const id = req.params.userId;       // Grabs the user's id from the request params
    let isAuth = false;             // Set a variable to determine if the user profile is the user making the request

    if (req.headers.authorization) {                            // If the user is logged in,
        const token = req.headers.authorization.split(" ")[1];          // Grabs the access token from the authorization header
        const decoded = jwt.verify(token, process.env.JWT_KEY);     // Verifies that the JSON Web Token is real

        if (id === decoded.userId) {    // If the id of the user and the access token data match,
            isAuth = true;          // The user profile is the user's
        };    
    };

    User.findById(id)       // Finds the user by their id     
        .exec()     // Initiates a promise for asynchronous requests 
        .then(docs => {           // If the response is complete,
            console.log(docs);     
            res.status(200).json({ docs, isAuth: isAuth });   // Return a status of 200 and the response 
        })
        .catch(err => {         // If there is an error,
            console.log(err);      
            res.status(500).json({ error: err });    // Return a status of 500 and the error
        });
});

router.get('/:userId/written_posts', (req, res, next) => {      // GET function for getting written posts of a user

    const id = req.params.userId;       // Grabs the users id from the request params

    Post.find({ authorId: id })     // Find all posts that have authorId of the user's id
        .exec()             // Initiates a promise
        .then(docs => {                 // If the request succeeds,
            console.log(docs);
            res.status(200).json({ docs });     // Return the posts
        })
        .catch(err => {                 // Catch any errors and send them
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.get('/:userId/liked_posts', checkAuth, async (req, res, next) => {       // GET function for getting a user's liked posts

    const id = req.params.userId;                           // Grabs the user's id from the request params
    const user = await User.findById(req.userData.userId);      // Finds the user by id

    if (user._id.equals(id)) {                              // If the user profile is the user's 
        Post.find({ '_id': { $in: user.posts_liked } })             // Find all posts using ids from the user's posts_liked array
            .exec()             // Initiates a promise
            .then(docs => {                 // If the request succeeds,
                console.log(docs);
                res.status(200).json({ docs });     // Return the posts
            })
            .catch(err => {                 // Catch any errors and send them
                console.log(err);
                res.status(500).json({ error: err });
            });
    };
});

router.post('/signup', (req, res, next) => {        // POST function for a user to signup 
    
    if (req.body.username.length < 5 || req.body.username.length > 30) {            // Checks if username is the correct length
        return res.status(409).json({ message: "Username must be within 5 to 30 characters long" });
    };

    if (req.body.password.length < 5) {         // Checks if the password is the correct length
        return res.status(409).json({ message: "Password must be 5 characters or longer!" });
    };

    User.find({ $or: [{ email: req.body.email }, { username: req.body.username }] })    // Find a user whose email matches the email entered or username
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
                            password: hash          // Store hashed password
                        });
            
                        user
                            .save()             // Save the user to the database
                            .then(result => {       // If the response is complete,
                                console.log(result);       
                                res.status(201).json({
                                    message: 'User created'     // Return a status of 201 and a message
                                });
                            })
                            .catch(err => {         // If there was an error,
                                console.log(err);      
                                res.status(500).json({ error: err });        // Return a status of 500 and a message
                            });
                    };
                });
            };
        });
});

router.post('/login', (req, res, next) => {     // POST function to login a user 

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

                if (result) {          // If the user logged in successfully,
                    const accessToken = jwt.sign(     // Create a JSON Web Token
                        { email: user[0].email, userId: user[0]._id },          // Assign the user's data to the access token
                        process.env.JWT_KEY,   
                        { expiresIn: "15m" }        // Set the token to expire in 15 minutes
                    );

                    res.cookie('ichigo',            // Create and send an HTTP cookie to hold the refresh token
                        jwt.sign(                       // Create a JSON Web Token
                            { userId: user[0].id },         // Add the user's id
                            process.env.REFRESH_KEY, 
                            { expiresIn: '7d' }),           // Set it to expire in 7 days
                        { httpOnly: true, maxAge: 604800000 }    // Cookie config settings
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
            console.log(err);     
            res.status(500).json({ error: err });     // Return a status of 500 and the error
        });
});

router.post('/logout', (req, res, next) => {        // POST function for logging out a user

    res.cookie('ichigo', '', { httpOnly: true });       // Send the HTTP cookie as empty
    
    return res.status(200).json({                   // Return a message
        message: 'You logged out successfully'
    });
});

router.post('/refresh_token', async (req, res, next) => {       // POST function for refreshing the user's access token

    const token = req.cookies.ichigo;       // Grabs the refresh token from the HTTP cookie

    if (!token) {           // If there was no token, return a message
        return res.send({ ok: false, accessToken: '', message: 'No refresh token was detected' });
    };

    let refreshToken = null;        // Variable to hold new access token

    try {
        refreshToken = jwt.verify(token, process.env.REFRESH_KEY);      // Verify the refresh token
    } catch (err) {
        console.log(err);       // If the refresh token is invalid, return a message
        return res.send({ ok: false, accessToken: '', message: 'Refresh token was invalid' });  
    };

    const user = await User.findById(refreshToken.userId);      // Find the user using the refresh token

    if (!user) {        // If no user was found, return a message
        return res.send({ ok: false, accessToken: '', message: 'User not found' });
    };
                        
    const accessToken = jwt.sign(     // If all tests are passed, create a JSON Web Token
        { email: user.email, userId: user._id }, 
        process.env.JWT_KEY,   
        { expiresIn: "15m" }        // Set it to expire in 15 minutes
    );

    res.cookie('ichigo',        // Send a new HTTP cookie with a new refresh token
        jwt.sign(                   // Create a JSON Web Token to be the refresh token
            { userId: user.id }, 
            process.env.REFRESH_KEY, 
            { expiresIn: '7d' }),       // Set the token to expire in 7 days
        { httpOnly: true, maxAge: 604800000 }
    );

    return res.status(200).send({ accessToken: accessToken });      // Return the access token
});

router.delete('/:userId', checkAuth, (req, res, next) => {      // DELETE function to delete a user

    const id = req.params.userId        // Grabs the user id from the request params

    if (id.equals(req.userData.userId)) {       // If the user deleting is the actual user,
        User.deleteOne({ _id: req.params.userId })         // Remove the user with the id
            .exec()             // Initiates a promise for asynchronous requests
            .then(result => {           // If the response is complete,
                res.status(200).json({
                    message: 'User was deleted'     // Return a status of 200 and a message
                });
            })
            .catch(err => {         // If there was an error,
                console.log(err);           
                res.status(500).json({ error: err });     // Return a status of 500 and an error
            });
    };
});

module.exports = router;      