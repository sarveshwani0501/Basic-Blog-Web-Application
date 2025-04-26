// Require all required modules
require("dotenv").config();

const express = require("express");
const path = require("path");
const app = express();
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const { connectToMongoose } = require("./connection");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/auth");

const Blog = require("./models/blog");

const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
console.log(process.env.MONGO_URL);
connectToMongoose(process.env.MONGO_URL);

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));


app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

// Routes

// app.get("/", async (req, res) => {
//   console.log(req.user);
//   res.render("home", {
//     user: req.user,
//   });
// });

app.use("/user", userRoute);

app.use("/blog", blogRoute);

// Make the app to listen to the PORT

app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
