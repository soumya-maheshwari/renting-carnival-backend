const mongoose = require("mongoose");

const contactUsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("ContactUs", contactUsSchema);
