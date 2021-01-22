
// Written by: Gavin Cernek, 1/21/2021

import React from "react";              // Imports for React

import PostItem from "../PostItem/PostItem";
import "./PostList.css";

const PostList = props => {         // PostList component

    let content;

    if(!props.posts || props.posts.length === 0) {              // If there are currently no posts
        content = <p>There are currently no posts. Try creating one!</p>;
    } else {                    // If there are posts, map a PostItem for each post and display them in reverse order
        content = (
            <ul className="post-list">
                {props.posts.slice(0).reverse().map(post => (
                    <PostItem key={post._id} title={post.title} postBody={post.postBody} 
                            postId={post._id} author={post.author} authorId={post.authorId} isAuth={props.isAuth}
                    />
                ))}
            </ul>
        );
    };

    return <section id="posts">{content}</section>;
};

export default PostList;