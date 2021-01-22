
// Written by: Gavin Cernek, 1/21/2021

const jwt = require('jsonwebtoken');        // Require for JSON Web Token which is used for user authorization

module.exports = (req, res, next) => {      // Export this function to be available in other files
    try {        
        const token = req.headers.authorization.split(" ")[1];      // Grabs the token from the authorization header
        const decoded = jwt.verify(token, process.env.JWT_KEY);     // Verifies that the JSON Web Token belongs to the user
        req.userData = decoded;
        next();     // Pass to next middleware function
    } catch (error) {
        return res.status(401).json({           // If there is an error, respond with a message
            message: 'Authorization failed'
        });
    };
};