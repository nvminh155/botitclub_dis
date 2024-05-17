const { Schema, model } = require("mongoose");

const userSchma = new Schema({
  classId: {
    type: String,
    required: false,
  },
  displayName: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  surname: {
    type: String,
    required: false,
  },
  major: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  
});

module.exports = model("User", userSchma);
