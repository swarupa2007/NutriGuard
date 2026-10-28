
const IngredientReference = require("../models/IngredientReference");

function cleanText(value) {
  return String(value ?? "")
    .trim()
    .replace(/[®™]/g, "")
    .replace(/\s+/g, " ")
    .replace(/[.,;:]+$/, "");
}

function normalizeText(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/\biodi[sz]ed\b/g, "iodised")
    .replace(/\blodised\b/g, "iodised")
    .replace(/\bpuree\b/g, "puree")
    .replace(/[()[\],.:;]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractCodes(value) {
  const matches = String(value ?? "").match(
    /\b(?:E|INS)?\s*-?\s*(\d{3,4}[a-z]?)\b/gi
  ) || [];

  return [...new Set(matches.map((item) => {
    const match = item.match(/(\d{3,4}[a-z]?)/i);
    return match ? `E${match[1].toUpperCase()}` : "";
  }).filter(Boolean))];
}

async function findByName(name) {
  const normalized = normalizeText(name);

  if (!normalized) return null;

  // Escape user-supplied text before using it in a regex.
  const exact = new RegExp(`^${escapeRegex(normalized)}$`, "i");

  let reference = await IngredientReference.findOne({
    name: exact,
  }).lean();

  if (!reference) {
    reference = await IngredientReference.findOne({
      synonyms: exact,
    }).lean();
  }

  return reference;
}

async function decodeIngredient(ingredient) {
  const originalText = cleanText(
    typeof ingredient === "string"
      ? ingredient
      : ingredient?.name || ingredient?.text || ""
  );

  if (!originalText) {
    return {
      originalName: "",
      displayName: "Unidentified ingredient",
      purpose: "Needs verification.",
      explanation: "No ingredient text was provided.",
      identified: false,
    };
  }

  // First try the complete ingredient name.
  const withoutPercentage = originalText
    .replace(/\s*\(\s*\d+(?:\.\d+)?\s*%\s*\)/g, "")
    .trim();

  let reference = await findByName(withoutPercentage);

  if (reference) {
    return {
      originalName: originalText,
      displayName: reference.name,
      purpose: reference.function || "Ingredient reference.",
      explanation: reference.explanation || "",
      source: reference.source || "",
      sourceUrl: reference.sourceUrl || "",
      verified: Boolean(reference.verified),
      identified: true,
    };
  }

  // Then try explicitly printed additive codes.
  const codes = extractCodes(withoutPercentage);

  if (codes.length > 0) {
    const references = await IngredientReference.find({
      additiveCodes: { $in: codes },
    }).lean();

    const referenceByCode = new Map();

    for (const item of references) {
      for (const code of item.additiveCodes || []) {
        referenceByCode.set(String(code).toUpperCase(), item);
      }
    }

    const matched = codes
      .map((code) => referenceByCode.get(code))
      .filter(Boolean);

    const uniqueMatched = [
      ...new Map(matched.map((item) => [String(item._id), item])).values(),
    ];

    const unknownCodes = codes.filter(
      (code) => !referenceByCode.has(code)
    );

    if (uniqueMatched.length > 0) {
      return {
        originalName: originalText,
        displayName: uniqueMatched.map((item) => item.name).join("; "),
        purpose: uniqueMatched
          .map((item) => item.function)
          .filter(Boolean)
          .filter((value, index, array) => array.indexOf(value) === index)
          .join("; ") || "Food additive reference.",
        explanation: uniqueMatched
          .map((item) => item.explanation)
          .filter(Boolean)
          .filter((value, index, array) => array.indexOf(value) === index)
          .join(" "),
        source: uniqueMatched.map((item) => item.source).filter(Boolean).join("; "),
        sourceUrl: uniqueMatched.map((item) => item.sourceUrl).filter(Boolean),
        verified: uniqueMatched.every((item) => Boolean(item.verified)),
        identified: unknownCodes.length === 0,
        note: unknownCodes.length
          ? `These codes need verification: ${unknownCodes.join(", ")}.`
          : "",
      };
    }

    return {
      originalName: originalText,
      displayName: originalText,
      purpose: "Additive code found; identity needs verification.",
      explanation: `The reference database does not yet recognise: ${codes.join(", ")}.`,
      identified: false,
      note: "Check the printed code against a reliable reference.",
    };
  }

  return {
    originalName: originalText,
    displayName: originalText,
    purpose: "Needs verification.",
    explanation:
      "NutriGuard does not yet have a matching ingredient reference.",
    identified: false,
    note: "Check the original package. An unknown ingredient is not automatically harmful.",
  };
}

async function decodeIngredients(ingredients) {
  if (!Array.isArray(ingredients)) return [];

  return Promise.all(ingredients.map(decodeIngredient));
}

module.exports = {
  decodeIngredient,
  decodeIngredients,
};
