const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Drug = require("./models/Drug");

// 👉 ADD THIS (create Interaction model)
const Interaction = require("./models/Interaction");

const drugs = require("./data/drugs");

dotenv.config();

const interactions = [
  {
    drug1: "Aspirin",
    drug2: "Ibuprofen",
    severity: "High",
    message: "Taking Aspirin with Ibuprofen may increase the risk of bleeding."
  },
  {
    drug1: "Paracetamol",
    drug2: "Ibuprofen",
    severity: "Low",
    message: "Generally safe, but use under guidance."
  },
  {
    drug1: "Amoxicillin",
    drug2: "Methotrexate",
    severity: "High",
    message: "May increase toxicity of Methotrexate."
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected for seeding...");

    // Clear old data
    await Drug.deleteMany({});
    await Interaction.deleteMany({});

    // Insert new data
    await Drug.insertMany(drugs);
    await Interaction.insertMany(interactions);

    console.log("Database seeded with drugs and interactions ✅");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();