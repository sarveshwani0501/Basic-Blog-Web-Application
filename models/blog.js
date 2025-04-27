const { Schema, model } = require("mongoose");

// blog schema for storing blog details
const blogSchema = new Schema(
  {
    title: {
      // title of the blog
      type: String,
      required: true,
    },
    body: {
      // main content of the blog
      type: String,
      required: true,
    },
    coverImageURL: {
      // cover image for the blog that will be visible on the UI
      type: String,
      required: false,
    },
    createdBy: {
      // details of the person who wrote the blog
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const Blog = model("blog", blogSchema);

module.exports = Blog;
