
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');  
const checkAuth = require('../middleware/check-auth');

const Post = require('../models/post');
const User = require('../models/user');

router.get('/', (req, res, next) => {

    Post.find()
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

router.get('/:postId', async (req, res, next) => {

    const id = req.params.postId;

    const post = await Post.findById(id);

    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const userId = decoded.userId;

        for (let i = 0; i < post.comments.length; i++) {
            if (post.comments[i].usersLiked.includes(userId)) {
                post.comments[i].isLiked = true;
            };
        };

        User.find({ '_id': userId, posts_liked: { $in: post._id } })
            .exec()
            .then(doc => {
                if (doc.length > 0) {
                    if (doc[0]._id.equals(post.authorId)) {
                        res.status(200).json({ post, isLiked: true, isAuth: true });
                    } else {
                        res.status(200).json({ post, isLiked: true, isAuth: false });
                    };
                } else {
                    if (userId === post.authorId.toString()) {
                        return res.status(200).json({ post, isLiked: false, isAuth: true });
                    } else {
                        return res.status(200).json({ post, isLiked: false, isAuth: false });
                    };
                };
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
    } else {
        res.status(200).json({ post });
    };
});

router.post('/', checkAuth, async (req, res, next) => {

    const user = await User.findById(req.userData.userId);

    const post = new Post({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        postBody: req.body.postBody,
        author: user.username,
        authorId: user._id
    });

    post
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Post was created',
                createdPost: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.patch('/:postId', checkAuth, async (req, res, next) => {

    const id = req.params.postId;
    const user = await User.findById(req.userData.userId);
    const post = await Post.findById({ _id: id });

    if (user._id.equals(post.authorId)) {
        const updateOps = {};

        for (const ops of req.body) {
            updateOps[ops.propertyName] = ops.value;
        };
    
        Post.findByIdAndUpdate({ _id: id }, { $set: updateOps })
            .exec()
            .then(result => {
                console.log(result);
                res.status(200).json({ result });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
    } else {
        return res.status(401).json({ message: 'Unauthorized to edit this post'} );
    };
});

router.patch('/:postId/comments', checkAuth, async (req, res, next) => {

    const id = req.params.postId;
    const user = await User.findById(req.userData.userId);

    const comment = {
        text: req.body.text,
        likes: 0,
        author: user.username,
        authorId: user._id,
        _id: new mongoose.Types.ObjectId()
    };

    Post.findByIdAndUpdate(id,
        { $push: { comments: comment }})
        .exec()         
        .then(result => {           
            console.log(result);        
            res.status(200).json({
                message: 'Comment successfully posted',
                createdComment: comment
            });
        })
        .catch(err => {  
            console.log(err);      
            res.status(500).json({ error: err }); 
        });
});

router.patch('/:postId/like', checkAuth, async (req, res, next) => {

    const id = req.params.postId;

    await User.findByIdAndUpdate(req.userData.userId, { '$push': { 'posts_liked': id }});
    const post = await Post.findByIdAndUpdate(id, { $inc: { likes: 1 }});
    
    User.findByIdAndUpdate(post.authorId, { $inc: { total_likes: 1 }})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Liked post",
            });
        })
        .catch(err => {
            console.log(err);      
            res.status(500).json({ error: err }); 
        });
});

router.patch('/:postId/unlike', checkAuth, async (req, res, next) => {

    const id = req.params.postId;

    await User.findByIdAndUpdate(req.userData.userId, { '$pull': { 'posts_liked': id }});
    const post = await Post.findByIdAndUpdate(id, { $inc: { likes: -1 }});
    
    User.findByIdAndUpdate(post.authorId, { $inc: { total_likes: -1 }})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Unliked post",
            });
        })
        .catch(err => {
            console.log(err);      
            res.status(500).json({ error: err }); 
        });
});

router.patch('/:postId/:commentId/like', checkAuth, async (req, res, next) => {

    const commentId = req.params.commentId;

    const user = await User.findById(req.userData.userId);

    await Post.findOneAndUpdate(
        { 'comments._id': commentId }, 
        { '$inc': { 'comments.$.likes': 1 }, '$push': { 'comments.$.usersLiked': user._id }})
        .exec()
        .then(result => {
            res.status(200).json({
                message:"Liked comment",
                doc: result
            });
        })
        .catch(err => {
            console.log(err);      
            res.status(500).json({error: err}); 
        });
});

router.patch('/:postId/:commentId/unlike', checkAuth, async (req, res, next) => {

    const commentId = req.params.commentId;

    const user = await User.findById(req.userData.userId);

    await Post.findOneAndUpdate(
        { 'comments._id': commentId }, 
        { '$inc': { 'comments.$.likes': -1 }, '$pull': { 'comments.$.usersLiked': user._id }})
        .exec()
        .then(result => {
            res.status(200).json({
                message:"Unliked comment",
                doc: result
            });
        })
        .catch(err => {
            console.log(err);      
            res.status(500).json({ error: err }); 
        });
});

router.delete('/:postId', checkAuth, async (req, res, next) => {
    
    const id = req.params.postId;

    const post = await Post.findById({ _id: id });
    const decrementTotalLikes = (post.likes * -1);

    const user = await User.findByIdAndUpdate(req.userData.userId, { $inc: { total_likes: decrementTotalLikes }});
    
    if (user._id.equals(post.authorId)) {
        Post.findByIdAndDelete({ _id: id })
            .exec()
            .then(result => {
                res.status(200).json({ result });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
    } else {
        return res.status(401).json({ message: 'Unauthorized to delete this post' });
    };
});

module.exports = router;