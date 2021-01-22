
// Written by: Gavin Cernek, 1/21/2021

import React, { useState } from "react";            // Imports for React

import TextArea from "../../TextArea/TextArea";
import "./CommentBox.css";

const CommentBox = props => {                   // CommentBox component

    const [commentBody, setCommentBody] = useState("");       // State variable for the commentBody

    const commentChangeHandler = event => {         // Function to change the comment's body
        setCommentBody(event.target.value);
    };

    const submitCommentHandler = event => {         // Function to submit the comment
        event.preventDefault();
        props.onAddComment(commentBody);
    };

    return (
        <section id="comment-box">
            <form onSubmit={submitCommentHandler}>
                <TextArea
                    type="text"
                    id="commentBody"
                    value={commentBody}
                    onChange={commentChangeHandler}
                    placeholder="Write a comment..."
                    cols="50"
                    rows="10"
                />
                <button type="submit" id="submit-comment">Post Comment</button>
            </form>
        </section>
    );
};

export default CommentBox;