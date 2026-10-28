
import thresholds from "./thresholds";

function analyzeProduct(product, conditions = {}) {
  const warnings = [];
  let score = 100;

  const nutrition = product?.nutrition || {};

  const ingredients = Array.isArray(product?.ingredients)
    ? product.ingredients
        .map((item) => {
          if (typeof item === "object" && item !== null) {
            return String(item.name || item.text || item.id || "").trim();
          }
          return String(item || "").trim();
        })
        .filter(Boolean)
    : typeof product?.ingredientsText === "string"
      ? product.ingredientsText
          .split(/,(?![^()]*\))/)
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  const addWarning = (type, title, message, severity, deduction) => {
    warnings.push({ type, title, message, severity });
    score -= deduction;
  };

  // Sodium screening
  const rawSodium = nutrition.sodiumMg ?? nutrition.sodium;
  const sodium =
    rawSodium !== null && rawSodium !== undefined && rawSodium !== ""
      ? Number(rawSodium)
      : NaN;

  if (conditions.hypertension) {
    if (Number.isFinite(sodium) && sodium >= 0) {
      const dailyLimit = thresholds.sodium.whoDailyLimit;
      const percentage = (sodium / dailyLimit) * 100;

      if (percentage >= 25) {
        addWarning(
          "sodium",
          "Sodium",
          `Contains ${sodium} mg sodium per 100 g, equivalent to ${percentage.toFixed(1)}% of the ${dailyLimit} mg adult daily reference. Actual intake depends on portion size.`,
          "high",
          25
        );
      }
    }
  }

  // Sugar screening
  const rawSugar = nutrition.totalSugar;
  const sugar =
    rawSugar !== null && rawSugar !== undefined && rawSugar !== ""
      ? Number(rawSugar)
      : NaN;

  if (conditions.diabetes) {
    if (Number.isFinite(sugar) && sugar >= 10) {
      addWarning(
        "sugar",
        "Total sugar",
        `Contains ${sugar} g total sugar per 100 g. Consider serving size and total carbohydrate intake. This is a preliminary NutriGuard screening rule, not an individual medical limit.`,
        "medium",
        20
      );
    }
  }

  // Detect additive codes from both the product field and ingredient text.
  const additiveCodes = new Set();

  const suppliedAdditives = Array.isArray(product?.additives)
    ? product.additives
    : [];

  suppliedAdditives.forEach((item) => {
    const value =
      typeof item === "object" && item !== null
        ? String(item.name || item.code || item.id || "")
        : String(item || "");

    const matches = value.match(/\b(?:E\s*)?\d{3,4}[a-z]?\b/gi) || [];

    matches.forEach((code) => {
      additiveCodes.add(code.replace(/\s+/g, "").toUpperCase());
    });

    if (matches.length === 0 && value.trim()) {
      additiveCodes.add(value.trim());
    }
  });

  ingredients.forEach((ingredient) => {
    const matches =
      ingredient.match(/\b(?:E\s*)?\d{3,4}[a-z]?\b/gi) || [];

    matches.forEach((code) => {
      additiveCodes.add(code.replace(/\s+/g, "").toUpperCase());
    });
  });

  if (conditions.avoidAdditives) {
    if (additiveCodes.size > 0) {
      addWarning(
        "additives",
        "Additive codes detected",
        `The available product data contains these possible additive codes: ${[...additiveCodes].join(", ")}. Their presence alone does not establish that they are harmful. Verify the codes against the package label.`,
        "medium",
        15
      );
    } else if (ingredients.length > 0) {
      warnings.push({
        type: "additives",
        title: "Additive information needs review",
        message:
          "No recognizable numeric additive codes were detected. This does not mean the product is additive-free; review the complete ingredient label.",
        severity: "info",
      });
    }
  }

  // Celiac screening
  if (conditions.celiac) {
    const glutenTerms = [
      "wheat",
      "barley",
      "rye",
      "gluten",
      "malt",
    ];

    const match = ingredients.find((item) => {
      const text = item.toLowerCase();
      return glutenTerms.some((term) =>
        new RegExp(`\\b${term}\\b`, "i").test(text)
      );
    });

    if (match) {
      addWarning(
        "gluten",
        "Possible gluten source",
        `The label data includes "${match}". Verify gluten-free status and cross-contamination information.`,
        "high",
        40
      );
    }
  }

  // Vegan screening
  if (conditions.vegan) {
    const animalTerms = [
      "milk",
      "whey",
      "casein",
      "gelatin",
      "egg",
      "honey",
      "butter",
      "cheese",
      "cream",
      "lactose",
    ];

    const match = ingredients.find((item) => {
      const text = item.toLowerCase();
      return animalTerms.some((term) =>
        new RegExp(`\\b${term}\\b`, "i").test(text)
      );
    });

    if (match) {
      addWarning(
        "vegan",
        "Possible animal-derived ingredient",
        `The label data includes "${match}". Check the ingredient source and product labelling.`,
        "high",
        40
      );
    }
  }

  // Lactose intolerance screening
  if (conditions.lactose) {
    const lactoseTerms = [
      "lactose",
      "milk powder",
      "whey powder",
      "milk solids",
      "milk",
      "whey",
    ];

    const match = ingredients.find((item) => {
      const text = item.toLowerCase();
      return lactoseTerms.some((term) =>
        new RegExp(`\\b${term}\\b`, "i").test(text)
      );
    });

    if (match) {
      addWarning(
        "lactose",
        "Possible lactose source",
        `The label data includes "${match}". Confirm lactose content with the package or manufacturer.`,
        "medium",
        25
      );
    }
  }

  score = Math.max(0, Math.min(100, score));

  let verdict;
  if (score < 50) {
    verdict = "AVOID";
  } else if (score < 75) {
    verdict = "CAUTION";
  } else {
    verdict = "GOOD";
  }

  const missingNutrition = [];

  if (nutrition.totalSugar == null || nutrition.totalSugar === "") {
    missingNutrition.push("total sugar");
  }

  if (
    (nutrition.sodiumMg == null || nutrition.sodiumMg === "") &&
    (nutrition.sodium == null || nutrition.sodium === "")
  ) {
    missingNutrition.push("sodium");
  }

  return {
    score,
    verdict,
    warnings,
    missingNutrition,
    hasIngredients: ingredients.length > 0,
  };
}

export default analyzeProduct;
