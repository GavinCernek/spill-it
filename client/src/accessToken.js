
// Written by: Gavin Cernek, 1/21/2021

let accessToken = "";

export const setAccessToken = async (token) => {        // Function for setting the access token
    accessToken = token;
};

export const getAccessToken = () => {           // Function for getting the access token
    return accessToken;
};