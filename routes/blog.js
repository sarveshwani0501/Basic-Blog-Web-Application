const express = require("express");
const multer = require("multer");              // require multer for file upload and storage
const path = require("path");               
const User = require("../models/user");        //  require the User model
const Blog = require("../models/blog");        // require the Blog model
const router = express.Router();               // create an express router
const Comment = require("../models/comment");  // require the Comment model

const storage = multer.diskStorage({                // create a storage for cover images of blog using diskStorage function of multer
  destination: function (req, file, cb) {           // specify the location to save the images at
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {                // give a unique file name to the file
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});


const upload = multer({ storage: storage });          // a upload middleware is created using multer with storage location specified

router.get("/add-new", (req, res) => {                // renders the add Blog page 
  return res.render("addBlog", {
    user: req.user,                                   // also sends the user object 
  }); 
});

router.post("/", upload.single("coverImage"), async (req, res) => {   // route for uploading the blog 
  const { title, body } = req.body;                                   // extract title and body from the req body                                        
  const blog = await Blog.create({                                    // create a new Blog object and save in the database
    title,
    body,
    coverImageURL: `/uploads/${req.file.filename}`,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${blog._id}`);                          // redirect the user to the blog page
});

router.get("/:id", async (req, res) => {                                      // to view a particular blog
  const blog = await Blog.findById(req.params.id).populate("createdBy");      // find the blog using the id and also get the writer details using populate 
  const comments = await Comment.find({ blogId: req.params.id }).populate(    // Also get the comments on that blog post
    "createdBy"                                                               // populate to get the details of the comment writer
  );
  return res.render("blog", {                                                 // render the blog page
    user: req.user,                                                           // send the user,blog,comment details
    blog: blog,
    comments: comments,
  });
});

router.post("/comment/:blogId", async (req, res) => {                        // to store the comments on a particular blog
  const { content } = req.body;
  const comment = await Comment.create({                                      // get the content of the comment
    content,
    blogId: req.params.blogId,                                                // get the blog id from query parameters
    createdBy: req.user._id,                                                  // also get the user who commented 
  });
  console.log(comment);
  return res.redirect(`/blog/${req.params.blogId}`);                          // redirect to the same page
});

module.exports = router;                                                      // export the router
