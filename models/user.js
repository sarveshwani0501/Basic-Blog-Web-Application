const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// user Schema for authentication details

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },

    profileImageURL: {
      type: String,
      default: "/images/download.png",
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

// middleware to hash the password eveytime the password is modified the password will be hashed properly using this middleware

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.salt = salt;
    next();
  } catch (err) {
    next(err);
  }
});

// create a model for the schema 
const User = mongoose.model("user", userSchema);

// export the model
module.exports = User;
