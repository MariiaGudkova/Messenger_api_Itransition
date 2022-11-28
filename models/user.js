const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 40,
  }, 
  messages: [{sender: String, theme: String, text: String, time: String}]
}, {versionKey: false})

module.exports = mongoose.model("user", userSchema);