
// Written by: Gavin Cernek, 1/21/2021

import React, { useState } from "react";        // Imports for React

import axios from "axios";
import { useHistory } from "react-router-dom";

import Header from "../../Header/Header";
import Input from "../../Input/Input";
import "./UserSignup.css";

const UserSignup = () => {          // UserSignup component

    const history = useHistory();

    const [emailAddress, setEmailAddress] = useState("");       // State variables for UserSignup
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const setEmailAddressHandler = event => {       // Function that changes the email address
        setEmailAddress(event.target.value);
    };

    const setUsernameHandler = event => {       // Function that changes the username
        setUsername(event.target.value);
    };

    const setPasswordHandler = event => {       // Function that changes the password
        setPassword(event.target.value);
    };

    const createUserHandler = async (event) => {        // Function to create a user 
        event.preventDefault();

        try {
            const newUser = {           // Creates a newUser object
                email: emailAddress,
                username: username,
                password: password
            };

            await axios.post("/user/signup", newUser);      // Sends a POST request to the signup route
            history.push("/");                  // Pushes the user to the homepage
        } catch (error) {               // Catch any errors
            if (error.response && error.response.data.message) {
                alert(error.response.data.message);             // Display error messages
            } else {
                alert("Something went wrong while trying to signup! Make sure your email address is valid!");
            };
        };
    };

    return (
        <div className="signup">
            <Header/>

            <div className="signup-info">
                <h1>Signup for Spill It</h1>
                
                <form onSubmit={createUserHandler}>
                    <Input
                        type="text"
                        id="email"
                        label="Email Address"
                        value={emailAddress}
                        onChange={setEmailAddressHandler}
                        size="45"
                    />

                    <Input
                        type="text"
                        id="username"
                        label="Username"
                        value={username}
                        onChange={setUsernameHandler}
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

                    <button type="submit">Create</button>
                </form>
            </div>
        </div>
    );
};

export default UserSignup;