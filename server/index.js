const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Drug = require("./models/Drug");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* ---------------- INTERACTION DATA ---------------- */
const interactionRules = [
  {
    pair: ["aspirin", "ibuprofen"],
    severity: "High",
    message: "Taking Aspirin with Ibuprofen may increase the risk of bleeding."
  },
  {
    pair: ["paracetamol", "ibuprofen"],
    severity: "Low",
    message: "Generally safe, but prolonged combined use should be monitored."
  },
  {
    pair: ["ibuprofen", "losartan"],
    severity: "Moderate",
    message: "Ibuprofen may reduce the effect of Losartan and affect kidneys."
  },
  {
    pair: ["atorvastatin", "azithromycin"],
    severity: "Moderate",
    message: "May increase risk of muscle-related side effects."
  },
  {
    pair: ["metformin", "ibuprofen"],
    severity: "Mild",
    message: "Use cautiously in patients with kidney issues."
  },
  {
    pair: ["amlodipine", "atorvastatin"],
    severity: "Mild",
    message: "Amlodipine may increase atorvastatin levels."
  }
];

/* ---------------- HELPERS ---------------- */
const normalizeName = (name = "") => name.trim().toLowerCase();
const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findInteraction = (drugA, drugB) => {
  const a = normalizeName(drugA);
  const b = normalizeName(drugB);

  return interactionRules.find((rule) => {
    const [d1, d2] = rule.pair;
    return (
      (d1 === a && d2 === b) ||
      (d1 === b && d2 === a)
    );
  });
};

/* ---------------- ROUTES ---------------- */

// Test route
app.get("/", (req, res) => {
  res.json({ success: true, message: "MediGuide API working" });
});

// Get all drugs
app.get("/drugs", async (req, res) => {
  try {
    const drugs = await Drug.find().sort({ name: 1 });
    res.json({ success: true, data: drugs });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch drugs"
    });
  }
});

// Search drugs by query param name
app.get("/drugs/search", async (req, res) => {
  try {
    const query = (req.query.name || "").trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Please provide a drug name in URL."
      });
    }

    const drugs = await Drug.find({
      name: { $regex: escapeRegex(query), $options: "i" }
    }).sort({ name: 1 });

    return res.json({ success: true, data: drugs });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to search drugs"
    });
  }
});

// Get drug by name
app.get("/drugs/:name", async (req, res) => {
  try {
    const drug = await Drug.findOne({
      name: { $regex: `^${req.params.name}$`, $options: "i" }
    });

    if (!drug) {
      return res.status(404).json({
        success: false,
        message: "Drug not found"
      });
    }

    res.json({ success: true, data: drug });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching drug"
    });
  }
});

// Interaction checker
app.post("/interactions", (req, res) => {
  const { drug1, drug2 } = req.body;

  if (!drug1 || !drug2) {
    return res.status(400).json({
      success: false,
      message: "Provide both drugs"
    });
  }

  const interaction = findInteraction(drug1, drug2);

  if (!interaction) {
    return res.json({
      success: true,
      hasInteraction: false,
      message: "No known interaction found in the demo dataset."
    });
  }

  res.json({
    success: true,
    hasInteraction: true,
    severity: interaction.severity,
    message: interaction.message
  });
});

/* ---------------- SERVER START ---------------- */

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB error:", err.message);
  });