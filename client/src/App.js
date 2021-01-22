
// Written by: Gavin Cernek, 1/21/2021

import React, { useState, useEffect } from "react";     // Imports for React

import axios from "axios";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./components/Home/Home";
import Search from "./components/Search/Search";
import UserSignup from "./components/Users/UserSignup/UserSignup";
import UserLogin from "./components/Users/UserLogin/UserLogin";
import UserLogout from "./components/Users/UserLogout/UserLogout";
import ViewUser from "./components/Users/ViewUser/ViewUser";
import ViewPost from "./components/Posts/ViewPost/ViewPost";
import EditPost from "./components/Posts/EditPost/EditPost";
import DeletePost from './components/Posts/DeletePost/DeletePost';
import Loader from "./components/Loader/Loader";
import Footer from "./components/Footer/Footer";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { getAccessToken, setAccessToken } from "./accessToken";
import "./App.css";

const App = () => {

  const [isLoading, setIsLoading] = useState(false);    // State variable

  useEffect(() => {   // UseEffect that runs once on mount
    
    const refreshAccessToken = async () => {    // Function to refresh the access token
      try {
        setIsLoading(true);
                                // Sends a POST request to the refresh_token route
        const response = await axios.post("/user/refresh_token", { data: null });

        const token = response.data.accessToken;    

        await setAccessToken(token);    // Set the resulting access token

        setIsLoading(false);
      } catch (error) {       // Catch any errors
          alert(error.message || "Something went wrong while fetching refresh token!");
      };
    };

    refreshAccessToken();
  }, []);

  if (isLoading) {    // If loading, display the loading spinner
    return <Loader />
  };

  const refreshAuthLogic = async (failedRequest) => {   // Function for refreshing the access token if it expires without refreshing the page
    try {         // Send a POST request to the refresh_token route
      const tokenRefreshResponse = await axios.post("/user/refresh_token", { data: null });
      const refreshedToken = tokenRefreshResponse.data.accessToken;
      
      await setAccessToken(refreshedToken);   // Sets the access token
      failedRequest.response.config.headers["Authorization"] = "Bearer " + getAccessToken();  // Resends the request with the new access token
      
      return Promise.resolve();
    } catch (error) {           // Catch any errors
        alert(error || "Something went wrong while fetching refresh token!");
    };
  };

  createAuthRefreshInterceptor(axios, refreshAuthLogic);    // Sets axios to use the refreshAuthLogic function

  return (
    <div className="App">
      <div className="content-wrap">
        <Router>
          <Switch>
              <Route path="/" exact component={Home}/>
              <Route path="/search" component={Search}/>
              <Route path="/signup" component={UserSignup}/>
              <Route path="/login" component={UserLogin}/>
              <Route path="/logout" component={UserLogout}/>
              <Route path="/user/:id" component={ViewUser}/>
              <Route path="/view/:id" component={ViewPost}/>
              <Route path="/edit/:id" component={EditPost}/>
              <Route path="/delete/:id" component={DeletePost}/>
          </Switch>
        </Router>
      </div>
      
      <Footer />
    </div>
  );
};

export default App;
