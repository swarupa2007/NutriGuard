const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const mongoose = require("mongoose");
const IngredientReference = require("../models/IngredientReference");

const references = [
  {
    name: "Water",
    synonyms: ["water"],
    function: "Liquid ingredient and solvent",
    explanation: "Helps dissolve or mix other ingredients.",
  },
  {
    name: "Sugar",
    synonyms: ["sugar", "sucrose"],
    function: "Sweetener",
    explanation: "Adds sweetness and contributes to carbohydrate intake.",
  },
  {
    name: "Iodised salt",
    synonyms: ["iodised salt", "iodized salt"],
    function: "Salt and iodine source",
    explanation: "Salt fortified with iodine; contributes to sodium intake.",
  },
  {
    name: "Tomato puree",
    synonyms: ["tomato puree", "tomato purée", "tomato paste"],
    function: "Flavour and texture ingredient",
    explanation: "Processed tomato used for flavour and body.",
  },
  {
    name: "Chilli puree",
    synonyms: ["chilli puree", "chilli purée", "chili puree", "chili purée"],
    function: "Flavour ingredient",
    explanation: "Processed chilli peppers add flavour and heat.",
  },
  {
    name: "Chilli powder",
    synonyms: ["chilli powder", "chili powder"],
    function: "Seasoning",
    explanation: "Ground chilli peppers used for flavour and heat.",
  },
  {
    name: "Garlic powder",
    synonyms: ["garlic powder"],
    function: "Seasoning",
    explanation: "Dried, ground garlic used for flavour.",
  },
  {
    name: "Ginger powder",
    synonyms: ["ginger powder"],
    function: "Seasoning",
    explanation: "Dried, ground ginger used for flavour.",
  },
  {
    name: "Acetic acid",
    synonyms: ["acetic acid", "e260", "260", "ins 260"],
    additiveCodes: ["E260", "INS260"],
    function: "Acidity regulator",
    explanation: "Helps control acidity and can contribute a sour taste.",
  },
  {
    name: "Sodium benzoate",
    synonyms: ["sodium benzoate", "e211", "211", "ins 211"],
    additiveCodes: ["E211", "INS211"],
    function: "Preservative",
    explanation: "Helps inhibit the growth of certain microorganisms in foods.",
  },
  {
    name: "Acetylated distarch adipate",
    synonyms: [
      "acetylated distarch adipate",
      "e1422",
      "1422",
      "ins 1422",
    ],
    additiveCodes: ["E1422", "INS1422"],
    function: "Modified starch and thickener",
    explanation: "Helps provide or maintain the desired food texture.",
  },
  {
    name: "Xanthan gum",
    synonyms: ["xanthan gum", "e415", "415", "ins 415"],
    additiveCodes: ["E415", "INS415"],
    function: "Thickener and stabiliser",
    explanation: "Helps control thickness and maintain a consistent texture.",
  },
  {
    name: "Sodium alginate",
    synonyms: ["sodium alginate", "e401", "401", "ins 401"],
    additiveCodes: ["E401", "INS401"],
    function: "Thickener and gelling agent",
    explanation: "Used to change or maintain food texture.",
  },
  {
    name: "Wheat",
    synonyms: ["wheat", "wheat flour"],
    function: "Grain ingredient",
    explanation: "Wheat is used in flour and many other food ingredients.",
  },
  {
    name: "Milk",
    synonyms: ["milk", "milk powder", "milk solids"],
    function: "Milk-derived ingredient",
    explanation:
      "Milk-derived ingredients vary in lactose content; the name alone does not establish the amount.",
  },
  {
    name: "Whey",
    synonyms: ["whey", "whey powder"],
    function: "Milk-derived ingredient",
    explanation: "Whey is milk-derived and may contain lactose.",
  },
  {
    name: "Gelatin",
    synonyms: ["gelatin", "gelatine"],
    function: "Gelling agent",
    explanation:
      "Usually derived from animal collagen; the source can vary.",
  },
  {
    name: "Lecithin",
    synonyms: ["lecithin", "soy lecithin", "soya lecithin"],
    function: "Emulsifier",
    explanation:
      "Helps ingredients such as oil and water mix. Check the source when relevant to allergies.",
  },
];

async function seedReferences() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from backend/.env");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  for (const item of references) {
    const { name, ...fields } = item;

    await IngredientReference.updateOne(
      { name },
      {
        $set: {
          ...fields,
          verified: false,
          source: "NutriGuard starter reference",
          sourceUrl: "",
        },
        $setOnInsert: { name },
      },
      { upsert: true }
    );
  }

  console.log(`Seeded ${references.length} ingredient references.`);
}

seedReferences()
  .catch((error) => {
    console.error("Ingredient seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
