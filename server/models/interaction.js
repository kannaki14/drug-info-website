const mongoose = require("mongoose");

const interactionSchema = new mongoose.Schema({
  drug1: {
    type: String,
    required: true
  },
  drug2: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low"
  },
  message: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Interaction", interactionSchema);