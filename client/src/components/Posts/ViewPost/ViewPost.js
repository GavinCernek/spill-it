
// Written by: Gavin Cernek, 1/21/2021

import React, { useState, useEffect } from "react";     // Imports for React

import axios from "axios";
import { Link, Redirect, useHistory } from "react-router-dom";

import Header from "../../Header/Header";
import CommentBox from "../../Comments/CommentBox/CommentBox";
import CommentList from "../../Comments/CommentList/CommentList";
import Loader from "../../Loader/Loader";
import LikeIcon from "../../../icons/like-icon.png";
import { getAccessToken } from "../../../accessToken";
import "./ViewPost.css";

const ViewPost = ({ match }) => {           // ViewPost component

    const history = useHistory();

    const [viewPostTitle, setViewPostTitle] = useState("");         // State variables for ViewPost component
    const [viewPostBody, setViewPostBody] = useState("");
    const [viewPostAuthor, setViewPostAuthor] = useState("");
    const [viewPostAuthorId, setViewPostAuthorId] = useState("");
    const [loadedComments, setLoadedComments] = useState([]);
    const [postLikes, setPostLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {                   // UseEffect that runs once on page load

        const fetchPost = async () => {         // Function for getting the post
            try {
                setIsLoading(true);

                let accessToken = getAccessToken();
                let response;

                if (accessToken) {      // If there is an access token, send a GET request with the access token
                    response = await axios.get("/posts/" + match.params.id, { headers: { "Authorization": `Bearer ${accessToken}` }});
                } else {                // If there is no access token, send a GET request with no token
                    response = await axios.get("/posts/" + match.params.id);
                };
                
                const data = await response.data.post;
                
                setViewPostTitle(data.title);
                setViewPostBody(data.postBody);         // Set all state variables
                setViewPostAuthor(data.author);
                setViewPostAuthorId(data.authorId);
                setLoadedComments(data.comments);
                setPostLikes(data.likes);
                setIsAuth(response.data.isAuth);
                setIsLiked(response.data.isLiked);
                setIsLoading(false);
            } catch (error) {               // Catch any errors
                alert(error.message || "Something went wrong getting this post!");
            };
        };

        fetchPost();
    }, []);

    if (isLoading) {            // If the page is loading, return the loading icon
        return <Loader />
    };

    const addCommentHandler = async (comment) => {      // Function for adding a comment
        try {
            const createComment = {         // Create the comment object
                text: comment
            };
    
            let accessToken = getAccessToken();
    
            if (accessToken) {      // If the user is logged in, send a PATCH request with the access token
                const response = await axios.patch("/posts/" + match.params.id + "/comments", createComment, { headers: { 'Authorization': `Bearer ${accessToken}` }});
    
                const createdComment = await response.data.createdComment;     
        
                setLoadedComments(prevComments => {         // Update the loadedComments state variable and concat the newly created comment
                    return prevComments.concat({
                      ...createdComment
                    });
                });
            } else {                // If the user is not logged in, send the to the login page
                setRedirect(true);
            };
        } catch (error) {               // Catch any errors
            alert(error.message || "Something went wrong trying to add this comment!");
        };
    };

    const likePostHandler = async () => {       // Function for liking a post
        try {
            let accessToken = getAccessToken();

            if (accessToken) {          // If the user is logged in, send a PATCH request with the access token
                await axios.patch("/posts/" + match.params.id + "/like", { data: null }, { headers: { 'Authorization': `Bearer ${accessToken}` }});

                setPostLikes(postLikes + 1);        // Update states
                setIsLiked(true);
            } else {                // If the user is not logged in, send them to the login page
                setRedirect(true);
            };
        } catch (error) {           // Catch any errors
            alert(error.message || "Something went wrong trying to like this post!");
        };
    };

    const unlikePostHandler = async () => {         // Function for unliking a post
        try {
            let accessToken = getAccessToken();

            if (accessToken) {          // If the user is logged in, send a PATCH request with the access token
                await axios.patch("/posts/" + match.params.id + "/unlike", { data: null }, { headers: { 'Authorization': `Bearer ${accessToken}` }});

                setPostLikes(postLikes - 1);        // Update states
                setIsLiked(false);
            };
        } catch (error) {               // Catch any errors
            alert(error.message || "Something went wrong trying to unlike this post!");
        };
    };

    const editPostButtonHandler = () => {           // Function to push user to the EditPost page
        history.push({ pathname: `/edit/${match.params.id}`, state: { title: viewPostTitle, postBody: viewPostBody }});
    };

    const deletePostButtonHandler = () => {         // Function to push the user to the DeletePost page
        history.push({ pathname: `/delete/${match.params.id}`, state: { title: viewPostTitle, postBody: viewPostBody }});
    };

    if (redirect) {         // Redirects the user to the login page
        return <Redirect to="/login" />;
    };

    let authorButtons;

    if (isAuth) {               // If the user if the author of the post, display the edit and delete buttons
        authorButtons = (
            <div className="edit-delete-post-button">
                <button onClick={editPostButtonHandler}>
                    Edit
                </button>
                
                <button onClick={deletePostButtonHandler}>
                    Delete
                </button>
            </div>
        );
    };

    let likePostButton;

    if (isLiked) {                  // If the user has liked the post, have the button go to the unlike route
        likePostButton = (
            <div className="like-post-unlike">
                <button onClick={unlikePostHandler}>
                    <img src={LikeIcon} alt="Like Icon"/>
                </button>
                <p>{postLikes}</p>
            </div>
        );
    } else {                    // If the user has not liked the post, have the button go to the like route
        likePostButton = (
            <div className="like-post-like">
                <button onClick={likePostHandler}>
                    <img src={LikeIcon} alt="Like Icon"/>
                </button>
                <p>{postLikes}</p>
            </div>
        );
    };

    return (
        <div className="view-post">
            <Header/>

            <div className="viewpost-body">
                <h2>{viewPostTitle}</h2>
                <h4>
                    <Link to={`/user/${viewPostAuthorId}`}>
                        Posted by: {viewPostAuthor}
                    </Link>
                </h4>
                <p>{viewPostBody}</p>
            </div>

            {likePostButton}
            {authorButtons}

            <div className="comments-section">
                <h1>Comments</h1>

                <CommentBox onAddComment={addCommentHandler}/>
                <CommentList comments={loadedComments} postId={match.params.id}/>
            </div>
        </div>
    );
};

export default ViewPost;