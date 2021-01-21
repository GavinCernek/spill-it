
const express = require('express');     // Requires for Express and Mongoose
const mongoose = require('mongoose');
const router = express.Router();        // Initiates a Router to transfer routes to be handled by this file

const Post = require('../models/post');     

function escapeRegex(text) {     // Method that takes text entered by the user into the search bar and replaces it with a regular expression to be used for searching
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get('/', (req, res, next) => {       // GET Method that searches for stories based on user searches from the search bar

    if (req.query.search) {     // If there is a search query,
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');  // Creates a regular expression using the escapeRegex function
        Post.find({ $or: [{ title: regex }, { postBody: regex }] })   // Search the database for any stories based on genre, author, and title of the story
            .select('-__v')     // Select all of the variables except __v
            .exec()            // Initiates promise for asynchronous requests 
            .then(docs => {         // Once the response is complete,
                console.log(docs);     // Log the response in the terminal
                res.status(200).json({ docs });       // Return a status of 200 and the search results
            })
            .catch(err => {     // If there was an error,
                console.log(err);       // Log the error
                res.status(500).json({ error: err });     // Return a status of 500 and the error
            });
    } else {      // If there was no search query,
        Post.find()        // Find all stories
        .select('-__v')     // Select all variables except __v
        .exec()     // Initiates a promise for asynchronous requests
        .then(docs => {         // Once the response is complete,
            console.log(docs);          // Log the response in the terminal
            res.status(200).json({docs});       // Return a status of 200 and the search results
        })
        .catch(err => {     // If there was an error,
            console.log(err);       // Log the error
            res.status(500).json({error: err});         // Return a status of 500 and the error
        });
    };
});

module.exports = router;    // Exports the Router to be used in other files