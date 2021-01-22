
// Written by: Gavin Cernek, 1/21/2021

import React, { useState, useEffect } from "react";     // Imports for React

import axios from "axios";
import { useHistory } from "react-router-dom";

import Header from "../../Header/Header";
import PostList from "../../Posts/PostList/PostList";
import Loader from "../../Loader/Loader";
import { getAccessToken } from "../../../accessToken";
import "./ViewUser.css";

const ViewUser = ({ match }) => {               // ViewUser component

    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState("");           // State variables for ViewUser
    const [writtenPosts, setWrittenPosts] = useState([]);
    const [numPosts, setNumPosts] = useState(0);
    const [numLikes, setNumLikes] = useState(0);
    const [isUser, setIsUser] = useState(false);
    const [postAuthor, setPostAuthor] = useState(false);

    const history = useHistory();

    useEffect(() => {               // UseEffect that runs when the id params change

        const fetchUser = async () => {     // Function for fetching the user
            try {
                setIsLoading(true);

                let accessToken = getAccessToken();

                let response;

                if (accessToken) {      // If the user is logged in, send a GET request with the access token
                    response = await axios.get("/user/" + match.params.id, { headers: { "Authorization": `Bearer ${accessToken}` }});
                } else {            // If the user is not logged in, send a GET request
                    response = await axios.get("/user/" + match.params.id);
                };
               
                const responseData = response.data.docs;

                setUsername(responseData.username);
                setNumLikes(responseData.total_likes);      // Update state variables
                setIsUser(response.data.isAuth);
                setPostAuthor(response.data.isAuth);
            } catch (error) {                           // Catch any errors
                alert("Something went wrong while fetching user!");
            };
        };

        const fetchPosts = async () => {        // Function to fetch posts written by the user profile
            try {               // Sends a GET request to retrieve the written posts
                const response = await axios.get("/user/" + match.params.id + "/written_posts");

                const responseData = await response.data.docs;

                setWrittenPosts(responseData);      // Set state variables
                setNumPosts(responseData.length);
                setIsLoading(false);
            } catch (error) {               // Display any errors
                alert("Something went wrong while fetching user's posts!");
            };
        };

        fetchUser();
        fetchPosts();
    }, [match.params.id]);

    if (isLoading) {        // If the page is loading, return the loading spinner
        return <Loader />;
    };

    const viewWrittenPostsHandler = async () => {       // Function for viewing the written posts
        try {           // GET request that gets the written posts
            const response = await axios.get("/user/" + match.params.id + "/written_posts");

            const responseData = await response.data.docs;
        
            setPostAuthor(true);            // State variables updated
            setWrittenPosts(responseData);
        } catch (error) {                   // Catch any errors
            alert("Something went wrong while fetching user's posts!");
        };
    };

    const viewLikedPostsHandler = async () => {     // Function for viewing user's liked posts
        try {
            let accessToken = getAccessToken();

            if (accessToken) {      // If the user is logged in, send a GET request with the access token
                const response = await axios.get("/user/" + match.params.id + "/liked_posts", { headers: { 'Authorization': `Bearer ${accessToken}` }});

                setPostAuthor(false);               // Update the state variables
                setWrittenPosts(response.data.docs);
            };
        } catch (error) {           // Catch any errors
            alert("Something went wrong while fetching user's liked posts!");
        }; 
    };

    const logoutPageHandler = () => {           // Function to send the user to the logout page
        history.push({ pathname: "/logout", state: { username: username }});
    };

    let userButtons;

    if (isUser) {               // If the user profile is the user's, then display the logout, view liked posts, and view written posts buttons
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