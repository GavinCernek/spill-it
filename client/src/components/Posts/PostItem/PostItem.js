
import React from "react";

import { Link, useHistory } from "react-router-dom";

import "./PostItem.css";

const PostItem = props => {

    const history = useHistory();

    const viewPostButtonHandler = () => {
        history.push({ pathname: `/view/${props.postId}` });
    };

    const editPostButtonHandler = () => {
        history.push({ pathname: `/edit/${props.postId}`, state: { title: props.title, postBody: props.postBody }});
    };

    const deletePostButtonHandler = () => {
        history.push({ pathname: `/delete/${props.postId}`, state: { title: props.title, postBody: props.postBody }});
    };

    let authorButtons;

    if (props.isAuth) {
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