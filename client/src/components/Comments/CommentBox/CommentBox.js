
import React, { useState } from "react";

import TextArea from "../../TextArea/TextArea";
import "./CommentBox.css";

const CommentBox = props => {

    const [commentBody, setCommentBody] = useState("");

    const commentChangeHandler = event => {
        setCommentBody(event.target.value);
    };

    const submitCommentHandler = event => {
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