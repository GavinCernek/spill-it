
// Written by: Gavin Cernek, 1/21/2021

import React, { useState, useEffect } from "react";         // Imports for React

import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";

import Header from "../../Header/Header";
import { getAccessToken } from "../../../accessToken";
import "./DeletePost.css";

const DeletePost = ({ match }) => {             // DeletePost component

    const [deleteTitle, setDeleteTitle] = useState("");         // State variables for DeletePost
    const [deleteBody, setDeleteBody] = useState("");

    const history = useHistory();           // History and location variables
    const location = useLocation();

    useEffect(() => {               // UseEffect that runs once on component mount

        setDeleteTitle(location.state.title);       // Sets state variable information
        setDeleteBody(location.state.postBody);        
    }, []);

    const deletePostHandler = async () => {         // Function for deleting a post
        try {
            const deletePost = await axios.get("/posts/" + match.params.id);    // Sends a GET request to grab the post to be deleted

            let accessToken = getAccessToken();

            if (accessToken) {      // If the user is logged in, send a DELETE request with the access token
                await axios.delete("/posts/" + match.params.id, { data: deletePost, headers: {'Authorization': `Bearer ${accessToken}`} });

                history.push("/");      // Push the user to the homepage
            };
        } catch (error) {                   // Catch any errors
            alert("Something went wrong while trying to delete this post!");
        };
    };

    const cancelDeleteHandler = () => {     // If the user cancels, send them to the homepage
        history.push("/");
    };

    return (
        <div className="delete-post">
            <Header />

            <div className="delete-post-body">
                <h1>Are you sure you want to delete the post titled "{deleteTitle}"?</h1>

                <button id="delete-button" onClick={deletePostHandler}>Yes</button>
                <button id="cancel-button" onClick={cancelDeleteHandler}>No</button>

                <div className="delete-info">
                    <h2 id="delete-title">
                        {deleteTitle}
                    </h2>
                    
                    <p id="delete-body">
                        {deleteBody}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DeletePost;