
// Written by: Gavin Cernek, 1/21/2021 

import React, { useState, useEffect } from "react";     // Imports for React

import axios from "axios";
import { Redirect } from "react-router-dom";

import Header from "../Header/Header";
import NewPost from "../Posts/NewPost/NewPost";
import PostList from "../Posts/PostList/PostList";
import Loader from "../Loader/Loader";
import { getAccessToken } from "../../accessToken";
import "./Home.css";

const Home = () => {          // Home component

  const [loadedPosts, setLoadedPosts] = useState([]);   // State variables for home 
  const [isLoading, setIsLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {           // UseEffect that runs once on component mount

    const fetchPosts = async () => {      // Function that gets all the posts to Spill It
      try {
        setIsLoading(true);

        const response = await axios.get("/posts");     // GET request for all posts
        const data = await response.data;

        setLoadedPosts(data.docs);      // Update state variables
        setIsLoading(false);
      } catch (error) {           // Catch any errors
        alert("Something went wrong trying to load the posts!");
      };
    };

    fetchPosts();
  }, []);

  const addPostHandler = async (postTitle, postText) => {     // Function for adding a new post
    try {
      const newPost = {       // Create a new post object
        title: postTitle,
        postBody: postText
      };

      let accessToken = getAccessToken();

      if (accessToken) {      // If the user is logged in, send a POST request with the access token
        const response = await axios.post("/posts", newPost, { headers: {'Authorization': `Bearer ${accessToken}`} });

        const responseData = await response.data.createdPost;

        setLoadedPosts(prevPosts => {         // Update the state variable and concat the newly created post
          return prevPosts.concat({
            ...responseData
          });
        });
      } else {            // If the user is not logged in, redirect to the login page
        setRedirect(true);
      };
    } catch (error) {       // Catch any errors
      alert("Something went wrong trying to create this post!");
    };
  };

  if (redirect) {
    return <Redirect to="/login" />;
  };

  return (
    <div className="home">
      <React.Fragment>
        <main>
          <Header/>
          <NewPost onAddPost={addPostHandler}/>
          {isLoading && <Loader/>}
          {!isLoading && <PostList posts={loadedPosts}/>}
        </main>
      </React.Fragment>
    </div>
  );
};

export default Home;
