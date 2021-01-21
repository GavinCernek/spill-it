
import React, { useState } from "react";

import axios from "axios";
import { Link, Redirect } from "react-router-dom";

import LikeIcon from "../../../icons/like-icon.png";
import { getAccessToken } from "../../../accessToken";
import "./Comment.css";


const Comment = props => {
    
    const [commentLikes, setCommentLikes] = useState(props.likes);
    const [isLiked, setIsLiked] = useState(props.isLiked);
    const [redirect, setRedirect] = useState(false);

    const likeCommentHandler = async () => {
        try {
            const id = props.commentId;
            let accessToken = getAccessToken();

            if (accessToken) {
                await axios.patch("/posts/" + props.postId + "/" + id + "/like", { data: null }, { withCredentials: true, headers: {'Authorization': `Bearer ${accessToken}`} });

                setIsLiked(true);
                setCommentLikes(commentLikes + 1);
            } else {
                setRedirect(true);
            };
        } catch (error) {
            alert("Something went wrong trying to like this comment!");
        };
    };

    const unlikeCommentHandler = async () => {
        try{
            const id = props.commentId;
            let accessToken = getAccessToken();

            if (accessToken) {
                await axios.patch("/posts/" + props.postId + "/" + id + "/unlike", { data: null }, { withCredentials: true, headers: {'Authorization': `Bearer ${accessToken}`} });

                setIsLiked(false);
                setCommentLikes(commentLikes - 1);
            };
        } catch (error) {
            alert("Something went wrong trying to unlike this comment!");
        };
    };

    if (redirect) {
        return <Redirect to="/login" />;
    };

    let likeCommentButton;

    if (isLiked) {
        likeCommentButton = (
            <button id="liked-button" onClick={unlikeCommentHandler}>
                <img src={LikeIcon} alt="Like Icon"/>
            </button>
        );
    } else {
        likeCommentButton = (
            <button id="unliked-button" onClick={likeCommentHandler}>
                <img src={LikeIcon} alt="Like Icon"/>
            </button>
        );
    };

    return (
        <li className="comment">
            <div className="comment-info">
                <h2>
                    <Link to={`/user/${props.authorId}`}>
                        {props.author}
                    </Link>
                </h2>
                <p>{props.commentBody}</p>
            </div>

            <div className="like-comment">
                {likeCommentButton}
                <p>{commentLikes}</p>
                <p>{isLiked}</p>
            </div>
        </li>
    );
};

export default Comment;