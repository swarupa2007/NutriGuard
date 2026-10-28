import analyzeProduct from "../../data/analysisRules";
import { decodeIngredients } from "../../data/ingredientDecoder";
function ResultDashboard({
  selectedUser,
  conditions = {},
  selectedProduct
}) {
  if (!selectedProduct) {
    return (
      <main className="flex-1 p-8">

        <div className="max-w-5xl mx-auto">

          <div className="bg-gray-900 border border-red-500/40 rounded-xl p-6">

            <h2 className="text-2xl font-bold text-red-400">
              No Product Selected
            </h2>

            <p className="text-gray-400 mt-2">
              Please search for a valid product before analyzing.
            </p>

          </div>

        </div>

      </main>

    );
  }
  const product = selectedProduct;
const nutrition = product.nutrition || {};

const analysis = analyzeProduct(product, conditions);

const verdictStyles = {
  GOOD: {
    card: "bg-emerald-500/10 border-emerald-500/40",
    text: "text-emerald-400",
    bar: "bg-emerald-500",
  },
  CAUTION: {
    card: "bg-orange-500/10 border-orange-500/40",
    text: "text-orange-400",
    bar: "bg-orange-500",
  },
  AVOID: {
    card: "bg-red-500/10 border-red-500/40",
    text: "text-red-400",
    bar: "bg-red-500",
  },
};

const verdictStyle =
  verdictStyles[analysis.verdict] || verdictStyles.CAUTION;

const missingRequiredData = [];

if (conditions.diabetes && nutrition.totalSugar == null) {
  missingRequiredData.push("Total sugar");
}

if (
  conditions.hypertension &&
  nutrition.sodiumMg == null &&
  nutrition.sodium == null
) {
  missingRequiredData.push("Sodium");
}

if (
  (conditions.celiac ||
    conditions.vegan ||
    conditions.lactose) &&
  !analysis.hasIngredients
) {
  missingRequiredData.push("Ingredients");
}


const hasIncompleteData = missingRequiredData.length > 0;
const decodedIngredients = decodeIngredients(
  Array.isArray(product.ingredients) && product.ingredients.length > 0
    ? product.ingredients
    : product.ingredientsText
      ? product.ingredientsText.split(",").map((item) => item.trim())
      : []
);

  // REST OF YOUR EXISTING JSX...
  return (
    <main className="flex-1 p-8">

      <div className="max-w-5xl mx-auto">

        {/* Header */}

        <div className="mb-8">

          <p className="text-emerald-400 font-medium mb-2">
            Analysis Complete
          </p>

          <h1 className="text-4xl font-bold text-white">
            Food Safety Report
          </h1>

          <p className="text-gray-400 mt-2">
            Personalized analysis based on your health profile.
          </p>

        </div>


        {/* Product Result */}

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <p className="text-gray-400 text-sm mb-2">
                PRODUCT
              </p>

              <h2 className="text-3xl font-bold text-white">
                {product.name}
              </h2>

              <p className="text-gray-400 mt-1">
                {product.description}
              </p>

            </div>


            {/* Verdict */}

           <div
  className={`${verdictStyle.card} border rounded-xl px-8 py-5 text-center`}
>
  <p className={`${verdictStyle.text} text-sm font-medium`}>
    HEALTH VERDICT
  </p>

  <p className={`${verdictStyle.text} text-3xl font-bold mt-1`}>
    {analysis.verdict}
  </p>
</div>

          </div>

        </div>


        {/* Health Score + Recommendation */}

        <div className="grid md:grid-cols-2 gap-6 mb-6">


          {/* Health Score */}

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">

            <p className="text-gray-400 mb-3">
              Health Safety Score
            </p>

            <div className="flex items-end gap-2">

            <span className={`text-5xl font-bold ${verdictStyle.text}`}>
  {analysis.score}
</span>
              <span className="text-gray-500 mb-2">
                / 100
              </span>

            </div>


           <div
  className={`${verdictStyle.bar} h-3 rounded-full transition-all`}
  style={{ width: `${analysis.score}%` }}
></div>


            <p className="text-gray-400 text-sm mt-3">
              Preliminary score based on the selected health profile.
            </p>

          </div>


          {/* Personalized Recommendation */}

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">

            <p className="text-gray-400 mb-3">
              Personalized Recommendation
            </p>

          <h3 className="text-xl font-semibold text-white mb-2">
  {hasIncompleteData
    ? "More information needed"
    : analysis.verdict === "AVOID"
    ? "Not recommended"
    : analysis.verdict === "CAUTION"
    ? "Consume with caution"
    : "No concerns triggered"}
</h3>

            <p className="text-gray-400">
              {analysis.verdict === "AVOID"
                ? "This product triggered one or more concerns based on the selected profile."
                : analysis.verdict === "CAUTION"
                ? "This product has some factors that should be considered for the selected profile."
                : "No major concerns were triggered by the current analysis rules."}
            </p>

          </div>

        </div>


      {/* Why Product Was Flagged */}

<div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">

  <h2 className="text-xl font-bold text-white mb-5">
    Why was this product flagged?
  </h2>

  <div className="space-y-4">

    {/* Incomplete Information Warning */}

    {hasIncompleteData && (
      <div className="border border-orange-500/30 bg-orange-500/5 rounded-lg p-4">
        <h3 className="text-orange-300 font-semibold">
          Incomplete product information
        </h3>

        <p className="text-gray-400 text-sm mt-1">
          Missing: {missingRequiredData.join(", ")}. Add or verify this
          information before relying on the personalized assessment.
        </p>
      </div>
    )}

    {/* Analysis Warnings */}

    {analysis.warnings.length === 0 ? (

      !hasIncompleteData && (
        <p className="text-gray-400">
          No specific concerns were triggered by the current rules.
          Check the information completeness before drawing conclusions.
        </p>
      )

    ) : (

      analysis.warnings.map((warning, index) => (

        <div key={index} className="flex gap-4">

          <span className="text-yellow-400 text-xl">
            ⚠️
          </span>

          <div>

            <h3 className="text-white font-semibold">
              {warning.title}
            </h3>

            <p className="text-gray-400 text-sm mt-1">
              {warning.message}
            </p>

          </div>

        </div>

      ))

    )}

  </div>

</div>
              
{/* Ingredient Decoder */}

<div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
  <h2 className="text-xl font-bold text-white mb-2">
    Ingredient Decoder
  </h2>

  <p className="text-gray-400 text-sm mb-5">
    Plain-English explanations of ingredients identified from the product
    label. Unverified ingredients are clearly marked.
  </p>

  {decodedIngredients.length === 0 ? (
    <p className="text-gray-400">
      No ingredient information is available for this product.
    </p>
  ) : (
    <div className="space-y-4">
      {decodedIngredients.map((ingredient, index) => (
        <div
          key={`${ingredient.originalName}-${index}`}
          className="border border-gray-800 rounded-lg p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold text-white">
              {ingredient.displayName}
            </h3>

            <span
              className={`text-xs px-2 py-1 rounded ${
                ingredient.identified
                  ? "bg-emerald-500/10 text-emerald-300"
                  : "bg-orange-500/10 text-orange-300"
              }`}
            >
              {ingredient.identified ? "Identified" : "Needs verification"}
            </span>
          </div>

          {ingredient.originalName !== ingredient.displayName && (
            <p className="text-gray-500 text-xs mt-1">
              Label text: {ingredient.originalName}
            </p>
          )}

          <p className="text-gray-300 text-sm mt-3">
            <span className="text-gray-200 font-medium">
              Purpose:
            </span>{" "}
            {ingredient.purpose}
          </p>

        {ingredient.caution || ingredient.note ? (
  <p className="text-gray-400 text-sm mt-2">
    <span className="text-gray-200 font-medium">Note:</span>{" "}
    {ingredient.caution || ingredient.note}
  </p>
) : null}
        </div>
      ))}
    </div>
  )}
</div>


        {/* Product Information + Active Profile */}

        <div className="grid md:grid-cols-2 gap-6">


          {/* Product Information */}

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">

            <h2 className="text-xl font-bold text-white mb-4">
              Product Information
            </h2>

           <div className="space-y-3 text-gray-400">

  <p>
    <span className="text-gray-200 font-medium">
      Category:
    </span>{" "}
    {product.category || "Not available"}
  </p>

  <p>
    <span className="text-gray-200 font-medium">
      Nutrition Basis:
    </span>{" "}
  {product.nutrition?.basis || "Not available"}
  </p>

  <p>
    <span className="text-gray-200 font-medium">
      Calories:
    </span>{" "}
    {nutrition.calories ?? "Not available"} kcal
  </p>

  <p>
    <span className="text-gray-200 font-medium">
      Sugar:
    </span>{" "}
    {nutrition.totalSugar ?? "Not available"} g
  </p>

  <p>
    <span className="text-gray-200 font-medium">
      Sodium:
    </span>{" "}
    {nutrition.sodiumMg ?? nutrition.sodium ?? "Not available"} mg
  </p>

  <p>
    <span className="text-gray-200 font-medium">
      Fat:
    </span>{" "}
    {nutrition.fat ?? "Not available"} g
  </p>

</div>

          </div>


          {/* Active User Profile */}

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">

            <h2 className="text-xl font-bold text-white mb-4">
              Active User Profile
            </h2>

            <div className="space-y-3 text-gray-400">

              <p>

                <span className="text-gray-200 font-medium">
                  User:
                </span>{" "}

                {selectedUser.name}

              </p>


              <p>

                <span className="text-gray-200 font-medium">
                  Age:
                </span>{" "}

                {selectedUser.age}

              </p>


              {/* Dynamic Conditions */}

              <p>

                <span className="text-gray-200 font-medium">
                  Active Conditions:
                </span>{" "}

                {[
                  conditions.diabetes && "Diabetes",
                  conditions.hypertension && "Hypertension",
                  conditions.celiac && "Celiac Disease",
                  conditions.vegan && "Vegan",
                  conditions.lactose && "Lactose Intolerance",
                  conditions.avoidAdditives && "Avoid Artificial Additives",
                ]
                  .filter(Boolean)
                  .join(", ") || "None selected"}

              </p>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default ResultDashboard;