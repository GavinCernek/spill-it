
import React, { useEffect, useState } from "react";

import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";

import Header from "../../Header/Header";
import { setAccessToken } from "../../../accessToken";
import "./UserLogout.css";

const UserLogout = () => {

    const history = useHistory();
    const location = useLocation();

    const [username, setUsername] = useState("");

    useEffect(() => {

        setUsername(location.state.username);
    }, []);

    const logoutHandler = async () => {
        try {
            await axios.post("/user/logout", { data: null }, { withCredentials: true })
            await setAccessToken(null);
            history.push("/");
        } catch (error) {
            alert("Something went wrong while trying to logout!");
        };
    };

    const cancelLogoutHandler = () => {
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