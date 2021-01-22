
// Written by: Gavin Cernek, 1/21/2021

import React, { useState } from "react";            // Imports for React

import axios from "axios";                              
import { Link, Redirect } from "react-router-dom";

import LikeIcon from "../../../icons/like-icon.png";        
import { getAccessToken } from "../../../accessToken";
import "./Comment.css";


const Comment = props => {          // Comment component
    
    const [commentLikes, setCommentLikes] = useState(props.likes);      // Set some comment props in state variables
    const [isLiked, setIsLiked] = useState(props.isLiked);
    const [redirect, setRedirect] = useState(false);

    const likeCommentHandler = async () => {        // Function for liking a comment
        try {
            const id = props.commentId;
            let accessToken = getAccessToken();     

            if (accessToken) {                          // If there is an access token, send a PATCH request with the token set in the authorization header
                await axios.patch("/posts/" + props.postId + "/" + id + "/like", { data: null }, { headers: {'Authorization': `Bearer ${accessToken}`} }); 
                setIsLiked(true);                       // Update states
                setCommentLikes(commentLikes + 1);
            } else {                        // If there is no access token, redirect to login page
                setRedirect(true);      
            };
        } catch (error) {                                                   // Display an error if the request fails
            alert("Something went wrong trying to like this comment!");
        };
    };

    const unlikeCommentHandler = async () => {          // Function for unliking a comment
        try{
            const id = props.commentId;
            let accessToken = getAccessToken();

            if (accessToken) {                       // If there is an access token, send a PATCH request with the token set in the authorization header
                await axios.patch("/posts/" + props.postId + "/" + id + "/unlike", { data: null }, { headers: {'Authorization': `Bearer ${accessToken}`} });

                setIsLiked(false);                      // Update states
                setCommentLikes(commentLikes - 1);
            };
        } catch (error) {                               // Display an error if the request fails
            alert("Something went wrong trying to unlike this comment!");
        };
    };

    if (redirect) {                             // Redirects to login page if user is not logged in
        return <Redirect to="/login" />;
    };

    let likeCommentButton;      

    if (isLiked) {                          // If the comment is liked,
        likeCommentButton = (                                                   // Set the like button to use the unlike function 
            <button id="liked-button" onClick={unlikeCommentHandler}>       
                <img src={LikeIcon} alt="Like Icon"/>
            </button>
        );
    } else {                                // If the comment has not been liked,
        likeCommentButton = (                                                       // Set the like button to use the like function
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