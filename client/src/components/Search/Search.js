
// Written by: Gavin Cernek, 1/21/2021

import React, { useState, useEffect } from "react";     // Imports for React

import axios from "axios";
import { useLocation } from "react-router-dom";

import PostList from "../Posts/PostList/PostList";
import Header from "../Header/Header";
import Loader from "../Loader/Loader";

const Search = () => {              // Search component

    const [foundPosts, setFoundPosts] = useState([]);       // State variables for Search
    const [isLoading, setIsLoading] = useState(false);

    const query = useLocation().search;         

    const searchQuery = new URLSearchParams(query).get("search");       // Grabs the search query from the URL

    useEffect(() => {               // UseEffect that runs whenever the search query is changed

        const searchPosts = async () => {           // Function for searching for posts
            try {
                setIsLoading(true);
                const response = await axios.get("/search" + `?search=${searchQuery}`);     // Sends a GET request using the search query
                const data = response.data.docs;

                setFoundPosts(data);        // Update the state variables
                setIsLoading(false);
            } catch (error) {           // Catch any errors
                alert("Something went wrong while searching for posts");
            };
        };

        searchPosts();
    }, [searchQuery]);      

    let searchResults;

    if (!foundPosts || foundPosts.length === 0) {       // If there are no results
        searchResults = <p>There were no results found for "{searchQuery}"</p>;
    } else {                    // If there are results, display them
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