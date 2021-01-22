
// Written by: Gavin Cernek, 1/21/2021

import React, { useState } from "react";        // Imports for React

import Input from "../../Input/Input";
import TextArea from "../../TextArea/TextArea";
import "./NewPost.css";

const NewPost = props => {          // NewPost component

    const [enteredTitle, setEnteredTitle] = useState("");       // Sets state variables for the NewPost
    const [enteredBody, setEnteredBody] = useState("");

    const titleChangeHandler = event => {           // Function that changes the post's title
        setEnteredTitle(event.target.value);
    };

    const bodyChangeHandler = event => {            // Function that changes the post's body
        setEnteredBody(event.target.value);
    };

    const submitPostHandler = event => {            // Function that submits the post
        event.preventDefault();
        props.onAddPost(enteredTitle, enteredBody);
    };

    return (
        <section id="new-post">
            <h2>Create a New Post</h2>
            <form onSubmit={submitPostHandler}>
                <Input
                    type="text"
                    id="title"
                    label="Title"
                    value={enteredTitle}
                    onChange={titleChangeHandler}
                    size="50"
                />
                
                <TextArea
                    type="text"
                    id="postBody"
                    label="Post Body"
                    value={enteredBody}
                    onChange={bodyChangeHandler}
                    cols="50"
                    rows="10"
                />
                <button type="submit">Create Post</button>
            </form>
        </section>
    );
};

export default NewPost;