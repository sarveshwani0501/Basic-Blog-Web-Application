// Require all required modules
require("dotenv").config();

const express = require("express");
const path = require("path");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const { connectToMongoose } = require("./connection");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/auth");

const Blog = require("./models/blog");

// create an app
const app = express();

// Set a port
const PORT = process.env.PORT || 8000;

// Set the view engines and define paths
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));


// connect to mongoose
connectToMongoose(process.env.MONGO_URL);

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));


// route to handle get request on the home page
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});            // extract all blogs from the DB
  res.render("home", {                            // render them on the home page
    user: req.user,
    blogs: allBlogs,
  });
});

// Routes

app.use("/user", userRoute);

app.use("/blog", blogRoute);


// Make the app to listen to the PORT

app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
