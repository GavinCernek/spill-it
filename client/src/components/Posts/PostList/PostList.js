
import React from "react";

import PostItem from "../PostItem/PostItem";
import "./PostList.css";

const PostList = props => {

    let content;

    if(!props.posts || props.posts.length === 0) {
        content = <p>There are currently no posts. Try creating one!</p>;
    } else {
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