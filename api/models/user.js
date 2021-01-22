
// Written by: Gavin Cernek, 1/21/2021

const mongoose = require('mongoose');      

const userSchema = mongoose.Schema({            // Schema for a user for Spill It
    _id: mongoose.Schema.Types.ObjectId,            // User's unique MongoDB id

    username: {                 // User's username must be between 5 and 30 characters
        type: String,       
        required: true,
        minlength: 5,
        maxlength: 30
    },

    email: {                // User's email and it must be unique and pass a regex in order to be accepted
        type: String,       
        required: true, 
        unique: true,       
        match: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    },

    password: {         // User's password must be at least 5 characters
        type: String,      
        required: true,
        minlength: 5
    },

    posts_liked: [{                             // Post ids for the post's liked by the user
        type: mongoose.Schema.Types.ObjectId,       
        ref: 'Post'
    }],

    total_likes: {                      // Total likes a user has across all posts                                                 
        type: Number,      
        default: 0
    }
});

module.exports = mongoose.model('User', userSchema);        // Exports the schema