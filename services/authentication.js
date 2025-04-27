const JWT = require("jsonwebtoken");

function createTokenForUser(user) {                         
  const payload = {                                         // create a payload 
    _id: user._id,                                          // add less but important user data to it
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };

  const token = JWT.sign(payload, process.env.JWT_SECRET)     // create token using payload and secret key

  return token;
}

function validateToken(token) {                                   // validate the token 
    const payload = JWT.verify(token, process.env.JWT_SECRET);    // extract payload from the token
    return payload;                                               // return the user details (payload)
}



module.exports = {
    createTokenForUser,
    validateToken
}