
import React, { useState } from "react";

import Input from "../../Input/Input";
import TextArea from "../../TextArea/TextArea";
import "./NewPost.css";

const NewPost = props => { 

    const [enteredTitle, setEnteredTitle] = useState("");
    const [enteredBody, setEnteredBody] = useState("");

    const titleChangeHandler = event => {
        setEnteredTitle(event.target.value);
    };

    const bodyChangeHandler = event => {
        setEnteredBody(event.target.value);
    };

    const submitPostHandler = event => {
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