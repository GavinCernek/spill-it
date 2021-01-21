
const mongoose = require('mongoose');      

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,        

    username: { 
        type: String,       
        required: true,
        minlength: 5,
        maxlength: 30
    },

    email: { 
        type: String,       
        required: true, 
        unique: true,       
        match: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    },

    password: { 
        type: String,      
        required: true,
        minlength: 5
    },

    posts_liked: [{
        type: mongoose.Schema.Types.ObjectId,       
        ref: 'Post'
    }],

    total_likes: {
        type: Number,       // Total likes across all stories a user has 
        default: 0
    }
});

module.exports = mongoose.model('User', userSchema);        // Exports the userSchema to be used in other files