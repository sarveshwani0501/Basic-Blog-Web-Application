const { validateToken } = require("../services/authentication");

// function to check Authentication of the user everytime a requst is sent to one of the API routes
// to keep the protected routes secure

function checkForAuthenticationCookie(tokenName) {   // get the tokenName
  return (req, res, next) => {                      // write a middleware function
    const token = req.cookies[tokenName];          // check for token value
    if (!token) {
      return next();                              // if token not found call next middleware i.e. user is not logged in
    }
    try {
      const user = validateToken(token);          // if token found validate using the function and get user details
      req.user = user;                            // send the user details in the req body
    } catch (error) {
      console.error("Invalid token:", error);     // if error send an error message
    }
    next();                                       // call the next middleware or proceed to the route 
  };
}

module.exports = {
  checkForAuthenticationCookie,   
};
