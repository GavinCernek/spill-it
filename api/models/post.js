
// Written by: Gavin Cernek, 1/21/2021

const mongoose = require('mongoose');       

const postSchema = mongoose.Schema({        // Schema for a post to Spill It
    _id: mongoose.Schema.Types.ObjectId,        // Unique MongoDB id
    
    title: {            // Post's title
        type: String,
        required: true
    },
    
    postBody: {         // Post's body
        type: String,
        required: true
    },
    
    author: {           // Post's author
        type: String,       
        required: true
    },

    authorId: {             // Author's id 
        type: mongoose.Schema.Types.ObjectId,       
        ref: 'User',
        required: true
    },

    likes: {                    // How many likes the post has 
        type: Number,
        default: 0
    },

    comments: [{                                // Comments array for the post
        _id: mongoose.Schema.Types.ObjectId,        // Comment's unique MongoDB id
        text: String,               // Comment's text
        likes: {                        // How many likes the comment has
            type: Number,
            default: 0
        },
        author: {               // Author of the comment
            type: String,
            required: true
        },
        authorId: {                 // Author's id of the comment
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        usersLiked: [{                              // Users id's for who has likes the comment
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        isLiked: {                      // Checks if the comment has been liked by the user before
            type: Boolean,
            default: false
        }
    }]
});

module.exports = mongoose.model('Post', postSchema);        // Exports the schema