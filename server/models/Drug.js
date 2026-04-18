const mongoose = require("mongoose");

// Defines the structure for each drug document in MongoDB.
const drugSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    usage: {
      type: String,
      required: true
    },
    dosage: {
      type: String,
      required: true
    },
    sideEffects: {
      type: [String],
      required: true
    },
    warnings: {
      type: [String],
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Drug", drugSchema);
