
import React, { useState, useEffect } from "react";

import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";

import Header from "../../Header/Header";
import { getAccessToken } from "../../../accessToken";
import "./DeletePost.css";

const DeletePost = ({ match }) => {

    const [deleteTitle, setDeleteTitle] = useState("");
    const [deleteBody, setDeleteBody] = useState("");

    const history = useHistory();
    const location = useLocation();

    useEffect(() => {

        setDeleteTitle(location.state.title);
        setDeleteBody(location.state.postBody);        
    }, []);

    const deletePostHandler = async () => {
        try {
            const deletePost = await axios.get("/posts/" + match.params.id);

            let accessToken = getAccessToken();

            if (accessToken) {
                await axios.delete("/posts/" + match.params.id, { data: deletePost, withCredentials: true, headers: {'Authorization': `Bearer ${accessToken}`} });

                history.push("/");
            };
        } catch (error) {
            alert("Something went wrong while trying to delete this post!");
        };
    };

    const cancelDeleteHandler = () => {
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