const express = require("express");

const router = express.Router();

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const User = require("../models/user");

const Blog = require("../models/blog");

const { createTokenForUser } = require("../services/authentication");

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({ message: "Email already exists" });
  }

  await User.create({
    fullName,
    email,
    password,
  });

  return res.redirect("/");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }
  console.log(user);
  const isMatch = await bcrypt.compare(password, user.password);

  console.log(isMatch);
  if (!isMatch) {
    return res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }

  const token = createTokenForUser(user);

  res.cookie("token", token);
  return res.redirect("/");
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;
