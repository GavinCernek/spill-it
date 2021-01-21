
import React, { useState } from "react";

import axios from "axios";
import { useHistory } from "react-router-dom";

import Header from "../../Header/Header";
import Input from "../../Input/Input";
import { setAccessToken } from "../../../accessToken";
import "./UserLogin.css";

const UserLogin = () => {

    const history = useHistory();

    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");

    const setEmailAddressHandler = event => {
        setEmailAddress(event.target.value);
    };

    const setPasswordHandler = event => {
        setPassword(event.target.value);
    };

    const loginUserHandler = async (event) => { 
        event.preventDefault();

        try {
            const loginUser = {
                email: emailAddress,
                password: password
            };

            const response = await axios.post("/user/login", loginUser, { withCredentials: true });

            await setAccessToken(response.data.accessToken);
            history.push("/");
        } catch (error) {
            if (error.response && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("Something went wrong while trying to login!");
            };
        };
    };

    return (
        <div className="login">
            <Header />

            <div className="login-info">
                <h1>Login to Shortie</h1>

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