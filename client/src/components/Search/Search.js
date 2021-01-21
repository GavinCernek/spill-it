
import React, { useState, useEffect } from "react";

import axios from "axios";
import { useLocation } from "react-router-dom";

import PostList from "../Posts/PostList/PostList";
import Header from "../Header/Header";
import Loader from "../Loader/Loader";

const Search = () => {

    const [foundPosts, setFoundPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const query = useLocation().search;

    const searchQuery = new URLSearchParams(query).get("search");

    useEffect(() => {

        const searchPosts = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get("/search" + `?search=${searchQuery}`);
                const data = response.data.docs;

                setFoundPosts(data);
                setIsLoading(false);
            } catch (error) {
                alert("Something went wrong while searching for posts");
            };
        };

        searchPosts();
    }, [searchQuery]);

    let searchResults;

    if (!foundPosts || foundPosts.length === 0) {
        searchResults = <p>There were no results found for "{searchQuery}"</p>;
    } else {
        searchResults = (
            <div className="found-posts">
                {isLoading && <Loader />}
                {!isLoading && <PostList posts={foundPosts}/>}
            </div>
        );
    };

    return (
        <div className="search-posts">
            <Header/>
            
            <h1>Showing search results for "{searchQuery}"</h1>
            {searchResults}
        </div>
    );
};

export default Search;