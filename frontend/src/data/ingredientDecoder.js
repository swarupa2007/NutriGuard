
const ingredientReference = [
  {
    names: ["water"],
    displayName: "Water",
    purpose: "Liquid ingredient and solvent.",
    explanation: "Helps dissolve or mix other ingredients.",
  },
  {
    names: ["sugar", "sucrose"],
    displayName: "Sugar (sucrose)",
    purpose: "Sweetener.",
    explanation: "Adds sweetness and contributes to carbohydrate intake.",
  },
  {
    names: ["iodised salt", "iodized salt"],
    displayName: "Iodised salt",
    purpose: "Salt and iodine source.",
    explanation: "Salt fortified with iodine. It contributes to sodium intake.",
  },
  {
    names: ["tomato paste", "tomato puree", "tomato purée"],
    displayName: "Tomato paste or purée",
    purpose: "Flavour and texture ingredient.",
    explanation: "Processed tomato used to give sauces tomato flavour and body.",
  },
  {
    names: ["chilli puree", "chilli purée", "chili puree", "chili purée"],
    displayName: "Chilli purée",
    purpose: "Flavour ingredient.",
    explanation: "Processed chilli peppers add flavour and heat.",
  },
  {
    names: ["chilli powder", "chili powder"],
    displayName: "Chilli powder",
    purpose: "Seasoning.",
    explanation: "Ground chilli peppers used to add flavour and heat.",
  },
  {
    names: ["garlic powder"],
    displayName: "Garlic powder",
    purpose: "Seasoning.",
    explanation: "Dried, ground garlic used for flavour.",
  },
  {
    names: ["ginger powder"],
    displayName: "Ginger powder",
    purpose: "Seasoning.",
    explanation: "Dried, ground ginger used for flavour.",
  },
  {
    names: ["acetic acid", "e260", "260"],
    displayName: "Acetic acid (E260)",
    purpose: "Acidity regulator.",
    explanation: "Helps control acidity and can contribute a sour taste.",
  },
  {
    names: ["sodium benzoate", "e211", "211"],
    displayName: "Sodium benzoate (E211)",
    purpose: "Preservative.",
    explanation: "Used to help inhibit the growth of certain microorganisms in foods.",
  },
  {
    names: ["acetylated distarch adipate", "e1422", "1422"],
    displayName: "Acetylated distarch adipate (E1422)",
    purpose: "Modified starch and thickener.",
    explanation: "Helps provide or maintain the desired food texture.",
  },
  {
    names: ["xanthan gum", "e415", "415"],
    displayName: "Xanthan gum (E415)",
    purpose: "Thickener and stabiliser.",
    explanation: "Helps control thickness and keep a consistent texture.",
  },
  {
    names: ["sodium alginate", "e401", "401"],
    displayName: "Sodium alginate (E401)",
    purpose: "Thickener and gelling agent.",
    explanation: "Used to change or maintain food texture.",
  },
  {
    names: ["wheat flour", "wheat"],
    displayName: "Wheat",
    purpose: "Grain ingredient.",
    explanation: "Wheat is used in flour and many other food ingredients.",
  },
  {
    names: ["milk powder", "milk solids", "milk"],
    displayName: "Milk-derived ingredient",
    purpose: "May contribute protein, flavour, fat or texture.",
    explanation: "Milk-derived ingredients vary in lactose content. The name alone does not establish the amount.",
  },
  {
    names: ["whey powder", "whey"],
    displayName: "Whey",
    purpose: "Milk-derived ingredient.",
    explanation: "Whey is a milk-derived ingredient that may contain lactose.",
  },
  {
    names: ["gelatin"],
    displayName: "Gelatin",
    purpose: "Gelling agent.",
    explanation: "Usually derived from animal collagen; the source can vary.",
  },
  {
    names: ["soy lecithin", "lecithin"],
    displayName: "Lecithin",
    purpose: "Emulsifier.",
    explanation: "Helps ingredients such as oil and water mix. The source should be checked when relevant to allergies.",
  },
];

const additiveCodes = {
  "1422": "Acetylated distarch adipate (E1422)",
  "415": "Xanthan gum (E415)",
  "401": "Sodium alginate (E401)",
  "260": "Acetic acid (E260)",
  "211": "Sodium benzoate (E211)",
};

function cleanLabel(value) {
  return String(value ?? "")
    .trim()
    .replace(/[®™]/g, "")
    .replace(/\s+/g, " ")
    .replace(/[.,;:]+$/, "");
}

function normalize(value) {
  return cleanLabel(value)
    .toLowerCase()
    .replace(/\blodised\b/g, "iodised")
    .replace(/\blodized\b/g, "iodized")
    .replace(/\bpuree\b/g, "purée")
    .replace(/\s+/g, " ")
    .trim();
}

function removePercentage(value) {
  return value
    .replace(/\s*\(\s*\d+(?:\.\d+)?\s*%\s*\)/g, "")
    .trim();
}

function findReference(value) {
  const normalized = normalize(removePercentage(value));

  return ingredientReference.find((item) =>
    item.names.some((name) => normalize(name) === normalized)
  );
}

function decodeOne(originalName) {
  const original = cleanLabel(originalName);
  const withoutPercentage = removePercentage(original);
  const reference = findReference(original);

  if (reference) {
    return {
      originalName: original,
      displayName: reference.displayName,
      purpose: reference.purpose,
      explanation: reference.explanation,
      identified: true,
    };
  }

  // Recognise only known codes explicitly present in the label.
  // Do not infer a code from a vague or badly OCR-read word.
  const codeMatches = [
    ...withoutPercentage.matchAll(/\b(?:E\s*)?(\d{3,4})\b/gi),
  ];

  if (codeMatches.length > 0) {
    const codes = [...new Set(codeMatches.map((match) => match[1]))];
    const known = codes.filter((code) => additiveCodes[code]);
    const unknown = codes.filter((code) => !additiveCodes[code]);

    if (known.length > 0) {
      return {
        originalName: original,
        displayName: known.map((code) => additiveCodes[code]).join(", "),
        purpose: "Food additive(s) identified by code.",
        explanation:
          "These additive codes have been matched to the NutriGuard reference list.",
        identified: unknown.length === 0,
        note:
          unknown.length > 0
            ? `These codes need verification: ${unknown.join(", ")}.`
            : "",
      };
    }

    return {
      originalName: original,
      displayName: original,
      purpose: "Additive code found; identity not verified.",
      explanation: "The code is not yet in the NutriGuard reference list.",
      identified: false,
    };
  }

  // Handle OCR that merged a known ingredient with a second word/code.
  // Only accept the known part when a recognised additive code is present.
  const knownCodeInText = Object.keys(additiveCodes).find((code) =>
    new RegExp(`\\b${code}\\b`).test(withoutPercentage)
  );

  if (knownCodeInText) {
    return {
      originalName: original,
      displayName: additiveCodes[knownCodeInText],
      purpose: "Food additive identified by code.",
      explanation:
        "The additive code was recognised, but the surrounding OCR text may contain errors.",
      identified: true,
      note: "Please verify the full ingredient wording against the package.",
    };
  }

  return {
    originalName: original,
    displayName: original || "Unidentified ingredient",
    purpose: "Not yet verified.",
    explanation:
      "NutriGuard does not yet have a verified explanation for this label entry.",
    identified: false,
    note: "Check the original package before relying on this identification.",
  };
}

export function decodeIngredient(value) {
  const original =
    typeof value === "object" && value !== null
      ? value.name || value.text || value.id || ""
      : String(value ?? "");

  const cleaned = cleanLabel(original);

  // Split combined additive-code groups such as "(1422, 415 & 401)".
  const codeGroup = cleaned.match(/\(([^)]*\d{3,4}[^)]*)\)/);

  if (codeGroup) {
    const codes = [
      ...codeGroup[1].matchAll(/\b(?:E\s*)?(\d{3,4})\b/gi),
    ].map((match) => match[1]);

    if (codes.length > 1) {
      const decodedCodes = [...new Set(codes)].map((code) => ({
        code,
        name: additiveCodes[code] || null,
      }));

      return {
        originalName: cleaned,
        displayName: decodedCodes
          .map((item) => item.name || `Unknown code ${item.code}`)
          .join("; "),
        purpose: "Multiple additive codes listed on the package.",
        explanation:
          "Each code is shown separately so the ingredients are easier to understand.",
        identified: decodedCodes.every((item) => Boolean(item.name)),
        note: decodedCodes.some((item) => !item.name)
          ? "One or more codes still need verification."
          : "Confirm the codes against the original package.",
      };
    }
  }

  return decodeOne(cleaned);
}
onkeydown
export function decodeIngredients(ingredients) {
  if (!Array.isArray(ingredients)) {
    return [];
  }

  return ingredients.map(decodeIngredient);
}
