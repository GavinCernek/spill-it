
// Written by: Gavin Cernek, 1/21/2021 

import React, { useState, useEffect } from "react";     // Imports for React

import axios from "axios";
import { Link } from "react-router-dom";

import SearchIcon from "../../icons/search-icon.png";
import HomeIcon from "../../icons/home-icon.png";
import { getAccessToken } from "../../accessToken";
import "./Header.css";

const Header = () => {          // Header component

    const [searchQuery, setSearchQuery] = useState("");     // State variables for header
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const searchQueryHandler = event => {       // Function that changes search query text
        setSearchQuery(event.target.value);
    };

    useEffect(() => {                       // UseEffect that runs once when component mounts
        const isLoggedIn = async () => {            // isLoggedIn function checks to see if there is a user currently logged in
            try {
                setIsLoading(true);
                let accessToken = getAccessToken();
                
                if (accessToken) {          // If there is an access token, send a GET request with the access token
                    const response = await axios.get("/user/current_user", { headers: {'Authorization': `Bearer ${accessToken}`} });
                    setUsername(response.data.docs.username);
                    setUserId(response.data.docs._id);          // Update the state variables with the user data
                    setLoggedIn(true);
                };

                setIsLoading(false);
            } catch (error) {                       // Catch and display errors
                alert("Something went wrong trying to get the current user!");
            };
        };

        isLoggedIn();
    }, []);

    let userStatus;

    if (isLoading) {
        userStatus = (
            <div></div>
        );
    } else {
        if (loggedIn) {                 // If the user is logged in, display their username as a link to their profile page
            userStatus = (
                <div className="user-profile">
                    <p>Logged in as: </p>
                    <Link to={`/user/${userId}`}>
                        <p>{username}</p>
                    </Link>
                </div>
            );
        } else {                    // If the user is not logged in, display signup and login buttons
            userStatus = (
                <div className="user-registration">
                    <Link to={"/signup"}>
                        <button>Signup</button>
                    </Link>
    
                    <Link to={"/login"}>
                        <button>Login</button>
                    </Link>
                </div>
            );
        };
    };    

    return (
        <div className="header-container">
            <div className="logo-container">
                <h1>Spill It</h1>
            </div>

            <div className="searchbar-container">
                <input
                    placeholder="Search for posts here..."
                    type="text"
                    onChange={searchQueryHandler}
                    size="50"
                />

                <Link to={`/search?search=${searchQuery}`}>
                    <img src={SearchIcon} alt="Search Icon" id="search-icon"/>
                </Link>
            </div>

            <div className="home-container">
                <Link to={"/"}>
                    <img src={HomeIcon} alt="Home Icon"/>
                </Link>

                {userStatus}
            </div>
        </div>
    );
};

export default Header;