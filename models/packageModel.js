const mongoose = require("mongoose");

const durationSchema = new mongoose.Schema({
  durationType: {
    type: String, // 'annual' or 'halfYearly'
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  numberOfProducts: {
    type: Number,
    required: true,
  },
  durations: [durationSchema],
});

module.exports = mongoose.model("Package", packageSchema);
