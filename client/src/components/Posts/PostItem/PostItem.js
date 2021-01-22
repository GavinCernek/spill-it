
// Written by: Gavin Cernek, 1/21/2021

import React from "react";          // Imports for React

import { Link, useHistory } from "react-router-dom";

import "./PostItem.css";

const PostItem = props => {         // PostItem component

    const history = useHistory();       // Variable for history

    const viewPostButtonHandler = () => {                   // Function that pushes user to the ViewPost page
        history.push({ pathname: `/view/${props.postId}` });
    };

    const editPostButtonHandler = () => {               // Function that pushes the user to the EditPost page
        history.push({ pathname: `/edit/${props.postId}`, state: { title: props.title, postBody: props.postBody }});
    };

    const deletePostButtonHandler = () => {             // Function that pushed the user to the DeletePost page
        history.push({ pathname: `/delete/${props.postId}`, state: { title: props.title, postBody: props.postBody }});
    };

    let authorButtons;

    if (props.isAuth) {             // If the user if the author of the post, display the edit and delete buttons
        authorButtons = (
            <div className="edit-delete-post-button">
                <button onClick={editPostButtonHandler}>
                    Edit
                </button>
                
                <button onClick={deletePostButtonHandler}>
                    Delete
                </button>
            </div>
        );
    };

    return (
        <li className="post">
            <div className="post-button">
                <div className="view-post-button">
                    <button onClick={viewPostButtonHandler}>
                        View Post
                    </button>
                </div>
                {authorButtons}
            </div>

            <div className="post-author">
                <p>Posted by: </p>
                <Link to={`/user/${props.authorId}`}>
                    <p>{props.author}</p>
                </Link>
            </div>
            
            <div className="post-title">
                <h2>{props.title}</h2>
            </div>
            
            <div className="post-body">
                <p>{props.postBody}</p>
            </div>
        </li>
    );
};

export default PostItem;