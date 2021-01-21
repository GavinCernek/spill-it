
import React, { useState, useEffect } from "react";

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

function App() {

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    
    const refreshAccessToken = async () => {
      try {
        setIsLoading(true);

        const response = await axios.post("/user/refresh_token", { data: null }, { withCredentials: true });

        const token = response.data.accessToken;

        await setAccessToken(token);

        setIsLoading(false);
      } catch (error) {
          alert(error.message || "Something went wrong while fetching refresh token!");
      };
    };

    refreshAccessToken();
  }, []);

  if (isLoading) {
    return <Loader />
  };

  const refreshAuthLogic = async (failedRequest) => {
    try {
      const tokenRefreshResponse = await axios.post("/user/refresh_token", { data: null }, { withCredentials: true });
      const refreshedToken = tokenRefreshResponse.data.accessToken;
      
      await setAccessToken(refreshedToken);
      failedRequest.response.config.headers["Authorization"] = "Bearer " + getAccessToken();
      
      return Promise.resolve();
    } catch (error) {
        alert(error || "Something went wrong while fetching refresh token!");
    };
  };

  createAuthRefreshInterceptor(axios, refreshAuthLogic);

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
