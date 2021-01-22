
// Written by: Gavin Cernek, 1/21/2021 

import React from "react";              // Imports for React

import Comment from "../Comment/Comment";
import "./CommentList.css";

const CommentList = props => {      // CommentList component

    let content;

    if (!props.comments || props.comments.length === 0) {               // If there are no comments yet
        content = <p>There are no comments yet. Try creating one!</p>
    } else {                                                                // If there are comments,
        content = (                                 // Map each comment into a Comment component and display it in reverse order, passing down the props to Comment component
            <ul className="comments-list">
                {props.comments.slice(0).reverse().map(comment => (
                    <Comment key={comment._id} commentBody={comment.text} likes={comment.likes} 
                            commentId={comment._id} postId={props.postId} author={comment.author}
                            authorId={comment.authorId} isLiked={comment.isLiked}
                    />
                ))}
            </ul>
        );
    };
    
    return <section id="comments">{content}</section>;
};

export default CommentList;