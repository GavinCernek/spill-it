
import React, { useState, useEffect } from "react";

import axios from "axios";
import { Link } from "react-router-dom";

import SearchIcon from "../../icons/search-icon.png";
import HomeIcon from "../../icons/home-icon.png";
import { getAccessToken } from "../../accessToken";
import "./Header.css";

const Header = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");

    const searchQueryHandler = event => {
        setSearchQuery(event.target.value);
    };

    useEffect(() => {
        const isLoggedIn = async () => {
            try {
                let accessToken = getAccessToken();
                
                if (accessToken) {
                    const response = await axios.get("/user/current_user", { withCredentials: true, headers: {'Authorization': `Bearer ${accessToken}`} });
                    setUsername(response.data.docs.username);
                    setUserId(response.data.docs._id);
                    setLoggedIn(true);
                };
            } catch (error) {
                alert("Something went wrong trying to get the current user!");
            };
        };

        isLoggedIn();
    }, []);

    let userStatus;

    if (loggedIn) {
        userStatus = (
            <div className="user-profile">
                <p>Logged in as: </p>
                <Link to={`/user/${userId}`}>
                    <p>{username}</p>
                </Link>
            </div>
        );
    } else {
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