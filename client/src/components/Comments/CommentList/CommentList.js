
import React from "react";

import Comment from "../Comment/Comment";
import "./CommentList.css";

const CommentList = props => {

    let content;

    if (!props.comments || props.comments.length === 0) {
        content = <p>There are no comments yet. Try creating one!</p>
    } else {
        content = (
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