
import React, { useState, useEffect } from "react";

import axios from "axios";
import { Redirect } from "react-router-dom";

import Header from "../Header/Header";
import NewPost from "../Posts/NewPost/NewPost";
import PostList from "../Posts/PostList/PostList";
import Loader from "../Loader/Loader";
import { getAccessToken } from "../../accessToken";
import "./Home.css";

const Home = () => {

  const [loadedPosts, setLoadedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {

    const fetchPosts = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get("/posts");
        const data = await response.data;

        setLoadedPosts(data.docs);
        setIsLoading(false);
      } catch (error) {
        alert("Something went wrong trying to load the posts!");
      };
    };

    fetchPosts();
  }, []);

  const addPostHandler = async (postTitle, postText) => {
    try {
      const newPost = {
        title: postTitle,
        postBody: postText
      };

      let accessToken = getAccessToken();

      if (accessToken) {
        const response = await axios.post("/posts", newPost, { withCredentials: true, headers: {'Authorization': `Bearer ${accessToken}`} });

        const responseData = await response.data.createdPost;

        setLoadedPosts(prevPosts => {
          return prevPosts.concat({
            ...responseData
          });
        });
      } else {
        setRedirect(true);
      };
    } catch (error) {
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
          {isLoading && <Loader />}
          {!isLoading && <PostList posts={loadedPosts}/>}
        </main>
      </React.Fragment>
    </div>
  );
};

export default Home;
