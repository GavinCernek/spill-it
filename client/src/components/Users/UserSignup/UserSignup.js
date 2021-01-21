
import React, { useState } from "react";

import axios from "axios";
import { useHistory } from "react-router-dom";

import Header from "../../Header/Header";
import Input from "../../Input/Input";
import "./UserSignup.css";

const UserSignup = () => {

    const history = useHistory();

    const [emailAddress, setEmailAddress] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const setEmailAddressHandler = event => {
        setEmailAddress(event.target.value);
    };

    const setUsernameHandler = event => {
        setUsername(event.target.value);
    };

    const setPasswordHandler = event => {
        setPassword(event.target.value);
    };

    const createUserHandler = async (event) => { 
        event.preventDefault();

        try {
            const newUser = {
                email: emailAddress,
                username: username,
                password: password
            };

            await axios.post("/user/signup", newUser);
            history.push("/");
        } catch (error) {
            if (error.response && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("Something went wrong while trying to signup! Make sure your email address is valid!");
            };
        };
    };

    return (
        <div className="signup">
            <Header/>

            <div className="signup-info">
                <h1>Signup for PostIT</h1>
                
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