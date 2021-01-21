
import React, { useState, useEffect } from "react";

import axios from "axios";
import { Link, Redirect, useHistory } from "react-router-dom";

import Header from "../../Header/Header";
import CommentBox from "../../Comments/CommentBox/CommentBox";
import CommentList from "../../Comments/CommentList/CommentList";
import Loader from "../../Loader/Loader";
import LikeIcon from "../../../icons/like-icon.png";
import { getAccessToken } from "../../../accessToken";
import "./ViewPost.css";

const ViewPost = ({ match }) => {

    const history = useHistory();

    const [viewPostTitle, setViewPostTitle] = useState("");
    const [viewPostBody, setViewPostBody] = useState("");
    const [viewPostAuthor, setViewPostAuthor] = useState("");
    const [viewPostAuthorId, setViewPostAuthorId] = useState("");
    const [loadedComments, setLoadedComments] = useState([]);
    const [postLikes, setPostLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {

        const fetchPost = async () => {
            try {
                setIsLoading(true);

                let accessToken = getAccessToken();
                let response;

                if (accessToken) {
                    response = await axios.get("/posts/" + match.params.id, { withCredentials: true, headers: { "Authorization": `Bearer ${accessToken}` }});
                } else {
                    response = await axios.get("/posts/" + match.params.id);
                };
                
                const data = await response.data.post;

                console.log(response);
                
                setViewPostTitle(data.title);
                setViewPostBody(data.postBody);
                setViewPostAuthor(data.author);
                setViewPostAuthorId(data.authorId);
                setLoadedComments(data.comments);
                setPostLikes(data.likes);
                setIsAuth(response.data.isAuth);
                setIsLiked(response.data.isLiked);
                setIsLoading(false);
            } catch (error) {
                alert(error.message || "Something went wrong getting this post!");
            };
        };

        fetchPost();
    }, []);

    if (isLoading) {
        return <Loader />
    };

    const addCommentHandler = async (comment) => {
        try {
            const createComment = {
                text: comment
            };
    
            let accessToken = getAccessToken();
    
            if (accessToken) {
                const response = await axios.patch("/posts/" + match.params.id + "/comments", createComment, { withCredentials: true, headers: { 'Authorization': `Bearer ${accessToken}` }});
    
                const createdComment = await response.data.createdComment;
        
                setLoadedComments(prevComments => {
                    return prevComments.concat({
                      ...createdComment
                    });
                });
            } else {
                setRedirect(true);
            };
        } catch (error) {
            alert(error.message || "Something went wrong trying to add this comment!");
        };
    };

    const likePostHandler = async () => {
        try {
            let accessToken = getAccessToken();

            if (accessToken) {
                await axios.patch("/posts/" + match.params.id + "/like", { data: null }, { withCredentials: true, headers: { 'Authorization': `Bearer ${accessToken}` }});

                setPostLikes(postLikes + 1);
                setIsLiked(true);
            } else {
                setRedirect(true);
            };
        } catch (error) {
            alert(error.message || "Something went wrong trying to like this post!");
        };
    };

    const unlikePostHandler = async () => {
        try {
            let accessToken = getAccessToken();

            if (accessToken) {
                await axios.patch("/posts/" + match.params.id + "/unlike", { data: null }, { withCredentials: true, headers: { 'Authorization': `Bearer ${accessToken}` }});

                setPostLikes(postLikes - 1);
                setIsLiked(false);
            };
        } catch (error) {
            alert(error.message || "Something went wrong trying to unlike this post!");
        };
    };

    const editPostButtonHandler = () => {
        history.push({ pathname: `/edit/${match.params.id}`, state: { title: viewPostTitle, postBody: viewPostBody }});
    };

    const deletePostButtonHandler = () => {
        history.push({ pathname: `/delete/${match.params.id}`, state: { title: viewPostTitle, postBody: viewPostBody }});
    };

    if (redirect) {
        return <Redirect to="/login" />;
    };

    let authorButtons;

    if (isAuth) {
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

    if (isLiked) {
        likePostButton = (
            <div className="like-post-unlike">
                <button onClick={unlikePostHandler}>
                    <img src={LikeIcon} alt="Like Icon"/>
                </button>
                <p>{postLikes}</p>
            </div>
        );
    } else {
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