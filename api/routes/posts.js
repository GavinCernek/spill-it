
// Written by: Gavin Cernek, 1/21/2021

const express = require('express');         // npm packages required 
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');  
const checkAuth = require('../middleware/check-auth');

const Post = require('../models/post');     // Imports the mongoose schemas 
const User = require('../models/user');

router.get('/', (req, res, next) => {       // GET function that fetches all posts

    Post.find()             // Find all posts
        .exec()         // Initiates a promise
        .then(docs => {             // When response is complete,
            console.log(docs);              
            res.status(200).json({ docs });     // Sends the documents
        })
        .catch(err => {                 // If there is an error, log it and send the error
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.get('/:postId', async (req, res, next) => {          // GET function for a single post using id

    const id = req.params.postId;           // Grabs the post's id from the request params 

    const post = await Post.findById(id);       // Find post with matching id

    if (req.headers.authorization) {                                // If the user is logged in,
        const token = req.headers.authorization.split(" ")[1];              // Grab their access token
        const decoded = jwt.verify(token, process.env.JWT_KEY);     // Verify that it is a valid token
        const userId = decoded.userId;              // Grab the user data from the token

        for (let i = 0; i < post.comments.length; i++) {            // For each comment in the post
            if (post.comments[i].usersLiked.includes(userId)) {     // Check if the usersLiked array for each comment has a match with the user's id
                post.comments[i].isLiked = true;        // If there is a match, then the comment is currently liked
            };
        };

        User.find({ '_id': userId, posts_liked: { $in: post._id } })            // Find's the user who made the request by id and checks if their posts_liked array contains the post's id
            .exec()                 // Initiates a promise
            .then(doc => {                                      // Once the response is ready,
                if (doc.length > 0) {           // If the user is found,
                    if (doc[0]._id.equals(post.authorId)) {             // If the user is the author of the post,
                        res.status(200).json({ post, isLiked: true, isAuth: true });        // Return the post as well as some booleans indicating the post has been liked and the user is the author
                    } else {        // If the user is not the author, return the booleans and the post
                        res.status(200).json({ post, isLiked: true, isAuth: false });
                    };
                } else {                                            // If no user is found,
                    if (userId === post.authorId.toString()) {          // Check to see if the user is the author of the post
                        return res.status(200).json({ post, isLiked: false, isAuth: true });        // If they are, then return the post and booleans
                    } else {                                                        // If they aren't, return post and booleans
                        return res.status(200).json({ post, isLiked: false, isAuth: false });
                    };
                };
            })
            .catch(err => {                         // Catch any errors and send them
                console.log(err);
                res.status(500).json({ error: err });
            });
    } else {                                // If user is not logged in, send post
        res.status(200).json({ post });
    };
});

router.post('/', checkAuth, async (req, res, next) => {         // POST function for making a new post

    const user = await User.findById(req.userData.userId);      // Find user by their userId

    const post = new Post({                     // Create a new post using the user data and request data
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        postBody: req.body.postBody,
        author: user.username,
        authorId: user._id
    });

    post                            
        .save()                     // Save the post to the database
        .then(result => {
            console.log(result);                
            res.status(201).json({                  // Return the created post and a message
                message: 'Post was created',
                createdPost: result
            });
        })
        .catch(err => {
            console.log(err);                           // Catch any errors and send them
            res.status(500).json({ error: err });
        });
});

router.patch('/:postId', checkAuth, async (req, res, next) => {         // PATCH function for editing a post

    const id = req.params.postId;                               // Grabs the post's id from the request params 
    const user = await User.findById(req.userData.userId);              // Finds the user who made the request by 
    const post = await Post.findById({ _id: id });                  // Finds the post by its id

    if (user._id.equals(post.authorId)) {           // If the user who made the request is the post's author,
        const updateOps = {};               // JSON object that holds the data to be updated

        for (const ops of req.body) {                   // For each piece of data in the request body,
            updateOps[ops.propertyName] = ops.value;        // Set the key-value pair in updateOps 
        };
    
        Post.findByIdAndUpdate({ _id: id }, { $set: updateOps })        // Find the post and update the fields using updateOps
            .exec()                 // Initiates a promise
            .then(result => {                   // If the update succeeds,
                console.log(result);
                res.status(200).json({ result });       // Return the edited post
            })
            .catch(err => {                     // Catch and send any errors
                console.log(err);
                res.status(500).json({ error: err });
            });
    } else {            // If the user is not the author, return a 401 status and a message
        return res.status(401).json({ message: 'Unauthorized to edit this post'} );
    };
});

router.patch('/:postId/comments', checkAuth, async (req, res, next) => {        // PATCH function for making comments in a post

    const id = req.params.postId;                               // Grabs the post's id from the request params
    const user = await User.findById(req.userData.userId);      // Finds the user who made the request by id

    const comment = {           // Create a new comment using the user and request data
        text: req.body.text,
        likes: 0,
        author: user.username,
        authorId: user._id,
        _id: new mongoose.Types.ObjectId()
    };

    Post.findByIdAndUpdate(id,                  // Find the post by id and update 
        { $push: { comments: comment }})            // Push the comment into the post's comments array
        .exec()                 // Initiates a promise
        .then(result => {                       // If the request succeeds, 
            console.log(result);                
            res.status(200).json({                          // Return the comment and a message
                message: 'Comment successfully posted',
                createdComment: comment
            });
        })
        .catch(err => {                         // Catch any errors and send them 
            console.log(err);      
            res.status(500).json({ error: err }); 
        });
});

router.patch('/:postId/like', checkAuth, async (req, res, next) => {        // PATCH function for liking a post

    const id = req.params.postId;                       // Grab the post id from the request params

    await User.findByIdAndUpdate(req.userData.userId, { '$push': { 'posts_liked': id }});   // Find the user who made the request by id and push the post's id into their posts_liked array
    const post = await Post.findByIdAndUpdate(id, { $inc: { likes: 1 }});           // Find the post by id and increment its likes
    
    User.findByIdAndUpdate(post.authorId, { $inc: { total_likes: 1 }})      // Find the post's author by id and increment their total_likes
        .exec()                     // Initiates a promise
        .then(result => {                   // If the request succeeds,
            console.log(result);
            res.status(200).json({                  // Return a message
                message: "Liked post",
            });
        })
        .catch(err => {                     // Catch any errors and send them
            console.log(err);      
            res.status(500).json({ error: err }); 
        });
});

router.patch('/:postId/unlike', checkAuth, async (req, res, next) => {          // PATCH function for unliking a post

    const id = req.params.postId;           // Grabs the post id from the request params

    await User.findByIdAndUpdate(req.userData.userId, { '$pull': { 'posts_liked': id }});       // Find the user who made the request and pull the post's id from their posts_liked array
    const post = await Post.findByIdAndUpdate(id, { $inc: { likes: -1 }});              // Find the post by its id and decrement its likes
    
    User.findByIdAndUpdate(post.authorId, { $inc: { total_likes: -1 }})         // Find the author of the post by id and decrement their total_likes
        .exec()                 // Initiates a promise
        .then(result => {                       // If the request succeeds, 
            console.log(result);
            res.status(200).json({              // Return a message
                message: "Unliked post",
            });
        })
        .catch(err => {             // Catch any errors and send them
            console.log(err);      
            res.status(500).json({ error: err }); 
        });
});

router.patch('/:postId/:commentId/like', checkAuth, async (req, res, next) => {     // PATCH function for liking a comment

    const commentId = req.params.commentId;     // Grabs the comment's id from the request params

    const user = await User.findById(req.userData.userId);          // Finds the user who made the request by id

    await Post.findOneAndUpdate(                // Find the post by id 
        { 'comments._id': commentId },      // Find the comment with the matching comment id
        { '$inc': { 'comments.$.likes': 1 }, '$push': { 'comments.$.usersLiked': user._id }})       // Increment its likes and push the user's id into the usersLiked array for that comment
        .exec()     // Initiates a promise
        .then(result => {                   // If the request succeeds, 
            res.status(200).json({              // Return a message and the result
                message:"Liked comment",
                doc: result
            });
        })
        .catch(err => {                 // Catch any errors and send them
            console.log(err);      
            res.status(500).json({error: err}); 
        });
});

router.patch('/:postId/:commentId/unlike', checkAuth, async (req, res, next) => {       // PATCH function to unlike a comment 

    const commentId = req.params.commentId;         // Grabs the comment's id from the request params

    const user = await User.findById(req.userData.userId);      // Finds the user who made the request by id

    await Post.findOneAndUpdate(                // Find the post by its id 
        { 'comments._id': commentId },                      // Find the comment with the same comment id
        { '$inc': { 'comments.$.likes': -1 }, '$pull': { 'comments.$.usersLiked': user._id }})      // Decrement its likes and pull the user's id from the usersLiked array
        .exec()                 // Initiates a promise
        .then(result => {                       // If the response succeeds,
            res.status(200).json({                  // Return a message and the result
                message:"Unliked comment",
                doc: result
            });
        })
        .catch(err => {                 // Catch any errors and send them
            console.log(err);      
            res.status(500).json({ error: err }); 
        });
});

router.delete('/:postId', checkAuth, async (req, res, next) => {        // DELETE function for a post
    
    const id = req.params.postId;       // Grabs the posts id from the request params 

    const post = await Post.findById({ _id: id });      // Finds the post by its id
    const decrementTotalLikes = (post.likes * -1);          // Calculates how many likes the user should lose after deleting this post

    const user = await User.findByIdAndUpdate(req.userData.userId, { $inc: { total_likes: decrementTotalLikes }});  // Find the user and decrement their total_likes 
    
    if (user._id.equals(post.authorId)) {       // If the user is the post's author,
        Post.findByIdAndDelete({ _id: id })         // Find the post by id and delete it
            .exec()                 // Initiates a promise
            .then(result => {                           // If the request succeeds, return the result
                res.status(200).json({ result });
            })
            .catch(err => {                     // Catch any errors and send them
                console.log(err);
                res.status(500).json({ error: err });
            });
    } else {            // If the user is not the author of the post then send a message
        return res.status(401).json({ message: 'Unauthorized to delete this post' });
    };
});

module.exports = router;