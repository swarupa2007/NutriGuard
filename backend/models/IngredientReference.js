const mongoose = require("mongoose");

const ingredientReferenceSchema = new mongoose.Schema(
  {
    // Standard ingredient name
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Alternative names used on food labels
    synonyms: {
      type: [String],
      default: [],
    },

    // Additive codes, such as E260 or INS 260
    additiveCodes: {
      type: [String],
      default: [],
    },

    // Main function of the ingredient
    function: {
      type: String,
      default: "",
    },

    // Simple explanation for users
    explanation: {
      type: String,
      default: "",
    },

    // Reference source for the information
    source: {
      type: String,
      default: "",
    },

    // Link to the source document or webpage
    sourceUrl: {
      type: String,
      default: "",
    },

    // Whether the information has been checked
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "IngredientReference",
  ingredientReferenceSchema
);
