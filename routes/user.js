const express = require("express");

const router = express.Router();

const bcrypt = require("bcrypt");       // require bcrypt for password hashing

const jwt = require("jsonwebtoken");     // require JWT for secure token creation

const User = require("../models/user");

const Blog = require("../models/blog");

const { createTokenForUser } = require("../services/authentication");       // import the function to create the token

router.get("/signin", (req, res) => {       // renders the sign in page
  return res.render("signin");
});

router.get("/signup", (req, res) => {       // renders the sign up page
  return res.render("signup");
});

router.post("/signup", async (req, res) => {        // save signup details of the user to the database
  const { fullName, email, password } = req.body;     

  const user = await User.findOne({ email });       // find the user 

  if (user) {
    return res.status(400).json({ message: "Email already exists" });   // if already exists send a bad request response
  }

  await User.create({             // if new user create a new user object and save in the database
    fullName,
    email,
    password,
  });

  return res.redirect("/");      // redirect to the home page  
});

router.post("/signin", async (req, res) => {        // route to signin user
  const { email, password } = req.body;             // get the email and password of the user
  const user = await User.findOne({ email });       // find the user in database
  if (!user) {
    return res.render("signin", {                   // if user not found redirect to signin page and give error message 
      error: "Incorrect Email or Password",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);    // check if password matches the hashed password inside the DB

  console.log(isMatch);
  if (!isMatch) {
    return res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }

  const token = createTokenForUser(user);                   // create a session token for the user

  res.cookie("token", token);                               // attach token with the cookie of response 
  return res.redirect("/");                                 // redirect to the homepage
});

router.get("/logout", (req, res) => {                       // route to logout 
  res.clearCookie("token");                                 // clear the cookie
  res.redirect("/");                                        // redirect to the home page 
});

module.exports = router;
