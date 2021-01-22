
// Written by: Gavin Cernek, 1/21/2021

import React, { useState, useEffect } from "react";     // Imports for React

import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";

import Header from "../../Header/Header";
import Input from "../../Input/Input";
import TextArea from "../../TextArea/TextArea";
import { getAccessToken } from "../../../accessToken";
import "./EditPost.css";

const EditPost = ({ match }) => {           // EditPost component

    const [editedTitle, setEditedTitle] = useState("");         // State variables for EditPost
    const [editedBody, setEditedBody] = useState("");
    const [originalTitle, setOriginalTitle] = useState("");

    const history = useHistory();           // History and location variables
    const location = useLocation();

    useEffect(() => {           // UseEffect that runs once on component mount

            setEditedTitle(location.state.title);       // Sets state variables for EditPost
            setEditedBody(location.state.postBody);
            setOriginalTitle(location.state.title);
    }, []);

    const editedTitleChangeHandler = event => {     // Function that changes the post's title
        setEditedTitle(event.target.value);
    };

    const editedBodyChangeHandler = event => {      // Function that changes the post's body
        setEditedBody(event.target.value);
    };

    const submitEditedPostHandler = async event => {        // Function that submits the edited post data
        event.preventDefault();

        try{
            const editedPost = [                                // Creates a new edited post
                {propertyName: "title", value: editedTitle},
                {propertyName: "postBody", value: editedBody}
            ];
            
            let accessToken = getAccessToken();

            if (accessToken) {              // If the user is logged in, send a PATCH request with the access token
                await axios.patch("/posts/" + match.params.id, editedPost, { headers: {'Authorization': `Bearer ${accessToken}`} });

                history.push("/");      // Push the user to the login page
            };
        } catch (error) {               // Catch any errors
            alert("Something went wrong while trying to edit this post!");
        };
    };

    const cancelEditHandler = () => {           // If the user cancels the edit, send them to the homepage
        history.push("/");
    };

    return (
        <div className="edit-post">
            <Header />

            <section id="edit-post-body">
                <h2>Edit Post Titled {originalTitle}</h2>
                <form onSubmit={submitEditedPostHandler}>
                    <Input
                        type="text"
                        id="title"
                        label="Title"
                        value={editedTitle}
                        onChange={editedTitleChangeHandler}
                        size="50"
                    />
                    
                    <TextArea
                        type="text"
                        id="postBody"
                        label="Post Body"
                        value={editedBody}
                        onChange={editedBodyChangeHandler}
                        cols="50"
                        rows="10"
                    />
                    <button type="submit">Edit Post</button>
                </form>

                <button onClick={cancelEditHandler}>Cancel</button>
            </section>
        </div>
    );
};

export default EditPost;
