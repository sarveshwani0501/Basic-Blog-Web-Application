const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(tokenName) {
  return (req, res, next) => {
    const token = req.cookies[tokenName];
    if (!token) {
      return next();
    }
    try {
      const user = validateToken(token);
      req.user = user;
    } catch (error) {
      console.error("Invalid token:", error);
    }
    next();
  };
}

module.exports = {
  checkForAuthenticationCookie,
};
