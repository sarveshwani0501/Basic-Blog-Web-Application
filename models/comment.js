const { Schema, model } = require("mongoose");

// comment schema for storing comments 

const commentSchema = new Schema(
  {
    content: {                        // body of the comment
      type: String,
      required: true,
    },
    createdBy: {                      // user who wrote the comment reffering to the user model 
      type: Schema.Types.ObjectId,     
      ref: "user",
    },
    blogId: {                         // the blog on which the user commented
      type: Schema.Types.ObjectId,
      ref: "blog",
    },
  },
  { timestamps: true }
);

const Comment = model("comment", commentSchema);

module.exports = Comment;