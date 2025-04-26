const mongoose = require("mongoose");

function connectToMongoose(url) {
  return mongoose.connect(url);
}

module.exports = {
  connectToMongoose,
};
