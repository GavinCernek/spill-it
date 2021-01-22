
// Written by: Gavin Cernek, 1/21/2021

import React, { useState } from "react";        // Imports for React

import axios from "axios";
import { useHistory } from "react-router-dom";

import Header from "../../Header/Header";
import Input from "../../Input/Input";
import { setAccessToken } from "../../../accessToken";
import "./UserLogin.css";

const UserLogin = () => {               // UserLogin component

    const history = useHistory();

    const [emailAddress, setEmailAddress] = useState("");       // State variables for UserLogin
    const [password, setPassword] = useState("");

    const setEmailAddressHandler = event => {       // Function that changes the email address
        setEmailAddress(event.target.value);
    };

    const setPasswordHandler = event => {       // Function that changes the password
        setPassword(event.target.value);
    };

    const loginUserHandler = async (event) => {         // Function that submits the login data
        event.preventDefault();

        try {
            const loginUser = {         // Creates a loginUser object 
                email: emailAddress,
                password: password
            };

            const response = await axios.post("/user/login", loginUser);  // Sends a POST request using the loginUser

            await setAccessToken(response.data.accessToken);        // Sets the access token
            history.push("/");                              // Pushes the user to the homepage 
        } catch (error) {               // Catch any errors
            if (error.response && error.response.data.message) {
                alert(error.response.data.message);                 // Display error messages
            } else {
                alert("Something went wrong while trying to login!");
            };
        };
    };

    return (
        <div className="login">
            <Header />

            <div className="login-info">
                <h1>Login to Spill It</h1>

                <form onSubmit={loginUserHandler}>
                    <Input
                        type="text"
                        id="email"
                        label="Email Address"
                        value={emailAddress}
                        onChange={setEmailAddressHandler}
                        size="45"
                    />

                    <Input
                        type="password"
                        id="password"
                        label="Password"
                        value={password}
                        onChange={setPasswordHandler}
                        size="45"
                    />

                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default UserLogin;