
const express = require("express");
const multer = require("multer");
const { createWorker } = require("tesseract.js");
const sharp = require("sharp");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});
const {
  decodeIngredients,
} = require("../services/ingredientDecoderService");

// --------------------------------
// INGREDIENT CLEANING
// --------------------------------

function cleanIngredient(ingredient) {
  return ingredient
    .replace(/\s+/g, " ")
    .replace(/^[\s,:;.-]+/, "")
    .replace(/[\s,:;.-]+$/, "")
    .trim();
}

// --------------------------------
// INGREDIENT PARSER
// Keeps commas inside parentheses
// --------------------------------

function splitIngredients(text) {
  const ingredients = [];
  let current = "";
  let parenthesesLevel = 0;

  for (const char of text) {
    if (char === "(") {
      parenthesesLevel++;
    } else if (char === ")") {
      parenthesesLevel = Math.max(0, parenthesesLevel - 1);
    }

    if (char === "," && parenthesesLevel === 0) {
      const cleaned = cleanIngredient(current);

      if (cleaned) {
        ingredients.push(cleaned);
      }

      current = "";
    } else {
      current += char;
    }
  }

  const cleaned = cleanIngredient(current);

  if (cleaned) {
    ingredients.push(cleaned);
  }

  return ingredients;
}

// --------------------------------
// OCR FUNCTION
// --------------------------------

async function runOCR(imageBuffer) {
  const worker = await createWorker("eng");

  try {
   await worker.setParameters({
  tessedit_pageseg_mode: "4",
});

    const result = await worker.recognize(imageBuffer);

    return result.data.text;
  } finally {
    await worker.terminate();
  }
}

// --------------------------------
// EXTRACT INGREDIENTS SECTION
// --------------------------------

function extractIngredientsSection(rawText) {
  const text = rawText
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ");

  const ingredientsMatch = text.match(
    /\bINGREDIENTS?\b\s*[:\-]?\s*([\s\S]*?)(?=\bCONTAINS\b|\bSTORE\b|\bSTORAGE\b|\bKEEP\b|\bBEST\s+BEFORE\b|$)/i
  );

  if (!ingredientsMatch) {
    return "";
  }

  return ingredientsMatch[1]
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ")
    .trim();
}

// --------------------------------
// OCR UPLOAD ROUTE
// --------------------------------

router.post(
  "/upload",
  upload.single("ingredientsImage"),
  async (req, res) => {
    try {
      const ingredientsFile = req.file;

      if (!ingredientsFile) {
        return res.status(400).json({
          message: "Ingredients image is required.",
        });
      }

      if (!ingredientsFile.mimetype.startsWith("image/")) {
        return res.status(400).json({
          message: "Please upload a valid image.",
        });
      }

      console.log("Ingredients image received:");
      console.log("File name:", ingredientsFile.originalname);
      console.log("File type:", ingredientsFile.mimetype);
      console.log("File size:", ingredientsFile.size);

      // --------------------------------
      // IMAGE PREPROCESSING
      // --------------------------------
// --------------------------------
// IMAGE PREPROCESSING
// --------------------------------

console.log("Preprocessing ingredients image...");

const ingredientsProcessedImage = await sharp(
  ingredientsFile.buffer
)
  .rotate()
  .flatten({ background: "#ffffff" })
  .resize({
    width: 2400,
    withoutEnlargement: false,
    kernel: "lanczos3",
  })
  .grayscale()
  .normalize()
  .linear(1.2, -10)
  .sharpen({
    sigma: 1,
    m1: 0.5,
    m2: 1.5,
  })
  .jpeg({ quality: 100 })
  .toBuffer();

      // --------------------------------
      // RUN OCR
      // --------------------------------

      console.log("Starting ingredients OCR...");

      const ingredientsTextRaw = await runOCR(
        ingredientsProcessedImage
      );

      console.log("Ingredients OCR completed.");
      console.log("Raw OCR text:");
      console.log(ingredientsTextRaw);

      // --------------------------------
      // EXTRACT INGREDIENTS
      // --------------------------------

      const ingredientsText =
        extractIngredientsSection(ingredientsTextRaw);

      const ingredients = splitIngredients(ingredientsText);
      const decodedIngredients = await decodeIngredients(ingredients);

console.log("Decoded ingredients:");
console.log(decodedIngredients);

      console.log("Extracted ingredients text:");
      console.log(ingredientsText);

      console.log("Structured ingredients:");
      console.log(ingredients);

      // --------------------------------
      // RESPONSE
      // --------------------------------

      res.json({
        message: ingredientsText
          ? "Ingredients OCR completed successfully"
          : "Could not identify the ingredients section. Please upload a clearer image.",

        ingredients: {
          fileName: ingredientsFile.originalname,
          extractedText: ingredientsTextRaw,
          ingredientsText,
          ingredients,

              decodedIngredients,
        },
      });
    } catch (error) {
      console.error("Ingredients OCR failed:", error);

      res.status(500).json({
        message: "Failed to process ingredients image with OCR",
      });
    }
  }
);

module.exports = router;
