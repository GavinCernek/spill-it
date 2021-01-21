
const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    
    title: {
        type: String,
        required: true
    },
    
    postBody: {
        type: String,
        required: true
    },
    
    author: {
        type: String,       
        required: true
    },

    authorId: {
        type: mongoose.Schema.Types.ObjectId,       
        ref: 'User',
        required: true
    },

    likes: {
        type: Number,
        default: 0
    },

    comments: [{
        _id: mongoose.Schema.Types.ObjectId,
        text: String,
        likes: {
            type: Number,
            default: 0
        },
        author: {
            type: String,
            required: true
        },
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        usersLiked: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        isLiked: {
            type: Boolean,
            default: false
        }
    }]
});

module.exports = mongoose.model('Post', postSchema);