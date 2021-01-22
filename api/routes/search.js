
// Written by: Gavin Cernek, 1/21/2021

const express = require('express');     // npm packages required
const mongoose = require('mongoose');
const router = express.Router();      

const Post = require('../models/post');     // Mongoose schema 

function escapeRegex(text) {     // Method that takes text entered by the user into the search bar and replaces it with a regular expression to be used for searching
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get('/', (req, res, next) => {       // GET function that searches for posts based on user searches from the search bar

    if (req.query.search) {     // If there is a search query,
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');  // Creates a regular expression using the escapeRegex function
        Post.find({ $or: [{ title: regex }, { postBody: regex }] })   // Search the database for any stories based on title and body of the post
            .select('-__v')    
            .exec()            // Initiates promise for asynchronous requests 
            .then(docs => {         // Once the response is complete,
                console.log(docs);     
                res.status(200).json({ docs });       // Return a status of 200 and the search results
            })
            .catch(err => {     // If there was an error,
                console.log(err);     
                res.status(500).json({ error: err });     // Return a status of 500 and the error
            });
    } else {      // If there was no search query,
        Post.find()        // Find all posts
        .select('-__v')     
        .exec()     // Initiates a promise for asynchronous requests
        .then(docs => {         // Once the response is complete,
            console.log(docs);          
            res.status(200).json({ docs });       // Return a status of 200 and the search results
        })
        .catch(err => {     // If there was an error,
            console.log(err);       
            res.status(500).json({ error: err });         // Return a status of 500 and the error
        });
    };
});

module.exports = router;