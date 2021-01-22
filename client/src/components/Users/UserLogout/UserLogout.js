
// Written by: Gavin Cernek, 1/21/2021

import React, { useEffect, useState } from "react";     // Imports for React

import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";

import Header from "../../Header/Header";
import { setAccessToken } from "../../../accessToken";
import "./UserLogout.css";

const UserLogout = () => {          // UserLogout component

    const history = useHistory();
    const location = useLocation();

    const [username, setUsername] = useState("");       // State variable for UserLogout

    useEffect(() => {           // UseEffect that runs once on load

        setUsername(location.state.username);
    }, []);

    const logoutHandler = async () => {         // Function that for logging the user out
        try {
            await axios.post("/user/logout", { data: null })    // Sends a POST request to the logout route
            await setAccessToken(null);         // Sets access token to null
            history.push("/");          // Pushes user to the homepage
        } catch (error) {                   // Catch any errors
            alert("Something went wrong while trying to logout!");
        };
    };

    const cancelLogoutHandler = () => {     // If the user cancels, push them to the homepage
        history.push("/");
    };

    return (
        <div className="logout">
            <Header/>

            <div className="logout-info">
                <h1>Are you sure you want to logout of {username}?</h1>

                <button onClick={logoutHandler}>Yes</button>
                <button onClick={cancelLogoutHandler}>No</button>
            </div>
        </div>
    );
};

export default UserLogout;