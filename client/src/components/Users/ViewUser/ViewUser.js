
import React, { useState, useEffect } from "react";

import axios from "axios";
import { useHistory } from "react-router-dom";

import Header from "../../Header/Header";
import PostList from "../../Posts/PostList/PostList";
import Loader from "../../Loader/Loader";
import { getAccessToken } from "../../../accessToken";
import "./ViewUser.css";

const ViewUser = ({ match }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [writtenPosts, setWrittenPosts] = useState([]);
    const [numPosts, setNumPosts] = useState(0);
    const [numLikes, setNumLikes] = useState(0);
    const [isUser, setIsUser] = useState(false);
    const [postAuthor, setPostAuthor] = useState(false);

    const history = useHistory();

    useEffect(() => {

        const fetchUser = async () => {
            try {
                setIsLoading(true);

                let accessToken = getAccessToken();

                let response;

                if (accessToken) {
                    response = await axios.get("/user/" + match.params.id, { withCredentials: true, headers: { "Authorization": `Bearer ${accessToken}` }});
                } else {
                    response = await axios.get("/user/" + match.params.id);
                };
               
                const responseData = response.data.docs;

                setUsername(responseData.username);
                setNumLikes(responseData.total_likes);
                setIsUser(response.data.isAuth);
                setPostAuthor(response.data.isAuth);
            } catch (error) {
                alert("Something went wrong while fetching user!");
            };
        };

        const fetchPosts = async () => {
            try {
                const response = await axios.get("/user/" + match.params.id + "/written_posts");

                const responseData = await response.data.docs;

                setWrittenPosts(responseData);
                setNumPosts(responseData.length);
                setIsLoading(false);
            } catch (error) {
                alert("Something went wrong while fetching user's posts!");
            };
        };

        fetchUser();
        fetchPosts();
    }, [match.params.id]);

    if (isLoading) {
        return <Loader />;
    };

    const viewWrittenPostsHandler = async () => {
        try {
            const response = await axios.get("/user/" + match.params.id + "/written_posts");

            const responseData = await response.data.docs;
        
            setPostAuthor(true);
            setWrittenPosts(responseData);
        } catch (error) {
            alert("Something went wrong while fetching user's posts!");
        };
    };

    const viewLikedPostsHandler = async () => {
        try {
            let accessToken = getAccessToken();

            if (accessToken) {
                const response = await axios.get("/user/" + match.params.id + "/liked_posts", { withCredentials: true, headers: { 'Authorization': `Bearer ${accessToken}` }});

                setPostAuthor(false);
                setWrittenPosts(response.data.docs);
            };
        } catch (error) {
            alert("Something went wrong while fetching user's liked posts!");
        }; 
    };

    const logoutPageHandler = () => {
        history.push({ pathname: "/logout", state: { username: username }});
    };

    let userButtons;

    if (isUser) {
        userButtons = (
            <div className="view-user-buttons">
                <button onClick={viewWrittenPostsHandler}>
                    View Written Posts
                </button>
                <button onClick={viewLikedPostsHandler}>
                    View Liked Posts
                </button>
                <button onClick={logoutPageHandler}>
                    Logout
                </button>
            </div>
        );
    };

    return (
        <div className="view-user">
            <Header />

            <div className="view-user-info">
                <h1>{username}</h1>
                <p>Total Posts: {numPosts}</p>
                <p>Total Likes: {numLikes}</p>
            </div>

            {userButtons}

            <div className="view-user-posts">
                {!isLoading && <PostList posts={writtenPosts} isAuth={postAuthor}/>}
            </div>
        </div>
    );
};

export default ViewUser;