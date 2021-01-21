
import React, { useState, useEffect } from "react";

import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";

import Header from "../../Header/Header";
import Input from "../../Input/Input";
import TextArea from "../../TextArea/TextArea";
import { getAccessToken } from "../../../accessToken";
import "./EditPost.css";

const EditPost = ({ match }) => {

    const [editedTitle, setEditedTitle] = useState("");
    const [editedBody, setEditedBody] = useState("");
    const [originalTitle, setOriginalTitle] = useState("");

    const history = useHistory();
    const location = useLocation();

    useEffect(() => {

            setEditedTitle(location.state.title);
            setEditedBody(location.state.postBody);
            setOriginalTitle(location.state.title);
    }, []);

    const editedTitleChangeHandler = event => {
        setEditedTitle(event.target.value);
    };

    const editedBodyChangeHandler = event => {
        setEditedBody(event.target.value);
    };

    const submitEditedPostHandler = async event => {
        event.preventDefault();

        try{
            const editedPost = [
                {propertyName: "title", value: editedTitle},
                {propertyName: "postBody", value: editedBody}
            ];
            
            let accessToken = getAccessToken();

            if (accessToken) {
                await axios.patch("/posts/" + match.params.id, editedPost, { withCredentials: true, headers: {'Authorization': `Bearer ${accessToken}`} });

                history.push("/");
            };
        } catch (error) {
            alert("Something went wrong while trying to edit this post!");
        };
    };

    const cancelEditHandler = () => {
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
