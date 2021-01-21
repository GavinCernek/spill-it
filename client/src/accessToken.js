
let accessToken = "";

export const setAccessToken = async (token) => {
    accessToken = token;
};

export const getAccessToken = () => {
    return accessToken;
};