const express = require("express");
const {
  decodeIngredient,
  decodeIngredients,
} = require("../services/ingredientDecoderService");

const router = express.Router();

// Decode one ingredient
router.post("/decode", async (req, res) => {
  try {
    const { ingredient } = req.body;

    if (!ingredient || typeof ingredient !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please provide an ingredient name.",
      });
    }

    const result = await decodeIngredient(ingredient);

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Ingredient decoding error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to decode ingredient.",
    });
  }
});

// Decode multiple ingredients
router.post("/decode-batch", async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!Array.isArray(ingredients)) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of ingredients.",
      });
    }

    const results = await decodeIngredients(ingredients);

    return res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Batch ingredient decoding error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to decode ingredients.",
    });
  }
});

module.exports = router;