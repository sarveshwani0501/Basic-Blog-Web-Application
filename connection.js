const mongoose = require("mongoose");

function connectToMongoose(url) {
  return mongoose                                 // connect to mongoDB using mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected successfully 🚀"))
    .catch((err) => console.error("MongoDB connection error: ", err));
}

module.exports = {
  connectToMongoose,
};
