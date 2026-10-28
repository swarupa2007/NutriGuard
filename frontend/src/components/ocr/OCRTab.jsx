import { useState } from "react";
import { Upload, Camera } from "lucide-react";

function OCRTab({ setSelectedProduct, onProductConfirmed }) {
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");

  const [nutrition, setNutrition] = useState({
    calories: "",
    carbohydrates: "",
    totalSugar: "",
    addedSugar: "",
    fat: "",
    saturatedFat: "",
    transFat: "",
    protein: "",
    fiber: "",
    sodiumMg: "",
  });

 const [ingredientsFile, setIngredientsFile] = useState(null);
const [ingredients, setIngredients] = useState([]);
const [ingredientsText, setIngredientsText] = useState("");
const [ocrCompleted, setOcrCompleted] = useState(false);
const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
const [decodedIngredients, setDecodedIngredients] = useState([]);
  const handleNutritionChange = (field, value) => {
    setNutrition({
      ...nutrition,
      [field]: value,
    });
  };

  const handleIngredientsChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a JPG, JPEG, or PNG image.");
      return;
    }

    setIngredientsFile(file);
    setError("");
  };

  const addProduct = async () => {
    if (!productName.trim()) {
      setError("Please enter the product name.");
      return;
    }

    if (!brand.trim()) {
      setError("Please enter the brand name.");
      return;
    }

    if (!ingredientsFile) {
      setError("Please upload the ingredients image.");
      return;
    }

    const hasNutritionValue = Object.values(nutrition).some(
      (value) => value.trim() !== ""
    );

    if (!hasNutritionValue) {
      setError("Please enter at least one nutrition value.");
      return;
    }

    try {
      setError("");
      setIsProcessing(true);

      // --------------------------------
      // SEND INGREDIENTS IMAGE TO OCR
      // --------------------------------

      const formData = new FormData();

      formData.append(
        "ingredientsImage",
        ingredientsFile
      );

      const response = await fetch(
        "http://localhost:5000/api/ocr/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Ingredients OCR failed.");
      }

      const ocrData = await response.json();

      console.log(
        "OCR RESPONSE:",
        JSON.stringify(ocrData, null, 2)
      );

      // --------------------------------
      // GET OCR INGREDIENTS
      // --------------------------------
const extractedIngredients =
  ocrData.ingredients?.ingredients || [];

const extractedIngredientsText =
  ocrData.ingredients?.ingredientsText || "";

const extractedDecodedIngredients =
  ocrData.ingredients?.decodedIngredients || [];

setIngredients(extractedIngredients);
setIngredientsText(extractedIngredientsText);
setDecodedIngredients(extractedDecodedIngredients);
setOcrCompleted(true);

return;

      // --------------------------------
      // CREATE PRODUCT
      // --------------------------------

      const product = {
        name: productName.trim(),

        brand: brand.trim(),

        category:
          category.trim() || "Packaged Food",

        nutrition: {
          basis: "100g",

          calories:
            nutrition.calories === ""
              ? null
              : Number(nutrition.calories),

          carbohydrates:
            nutrition.carbohydrates === ""
              ? null
              : Number(nutrition.carbohydrates),

          totalSugar:
            nutrition.totalSugar === ""
              ? null
              : Number(nutrition.totalSugar),

          addedSugar:
            nutrition.addedSugar === ""
              ? null
              : Number(nutrition.addedSugar),

          fat:
            nutrition.fat === ""
              ? null
              : Number(nutrition.fat),

          saturatedFat:
            nutrition.saturatedFat === ""
              ? null
              : Number(nutrition.saturatedFat),

          transFat:
            nutrition.transFat === ""
              ? null
              : Number(nutrition.transFat),

          protein:
            nutrition.protein === ""
              ? null
              : Number(nutrition.protein),

          fiber:
            nutrition.fiber === ""
              ? null
              : Number(nutrition.fiber),

          sodiumMg:
            nutrition.sodiumMg === ""
              ? null
              : Number(nutrition.sodiumMg),
        },

        // OCR ingredients
        ingredients: ingredients,

        ingredientsText: ingredientsText,

        additives: [],

        source: {
          name: "Manual",
        },
      };

      console.log(
        "MANUAL PRODUCT WITH OCR INGREDIENTS:",
        JSON.stringify(product, null, 2)
      );

      // --------------------------------
      // SEND PRODUCT TO APP
      // --------------------------------

      setSelectedProduct(product);

    } catch (error) {
      console.error("Add Product failed:", error);

      setError(
        "Could not process the ingredients image. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-2xl font-bold text-white">
          Add Product
        </h2>

        <p className="text-gray-400 mt-2">
          Enter the product information and nutrition values
          from the package label.
        </p>
      </div>

      {/* Product Information */}

      <div className="bg-gray-800 rounded-xl p-6">

        <h3 className="text-xl font-semibold text-white mb-5">
          Product Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label className="block text-gray-300 mb-2">
              Product Name
            </label>

            <input
              type="text"
              value={productName}
              onChange={(e) =>
                setProductName(e.target.value)
              }
              placeholder="Example: Oreo Original"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Brand
            </label>

            <input
              type="text"
              value={brand}
              onChange={(e) =>
                setBrand(e.target.value)
              }
              placeholder="Example: Oreo"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Category
            </label>

            <input
              type="text"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              placeholder="Example: Biscuits"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-emerald-500"
            />
          </div>

        </div>

      </div>

      {/* Nutrition */}

      <div className="bg-gray-800 rounded-xl p-6">

        <h3 className="text-xl font-semibold text-white">
          Nutrition Information
        </h3>

        <p className="text-gray-400 text-sm mt-1 mb-5">
          Enter values exactly as shown on the package,
          per 100g.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {[
            ["calories", "Calories", "kcal"],
            ["carbohydrates", "Carbohydrates", "g"],
            ["totalSugar", "Total Sugar", "g"],
            ["addedSugar", "Added Sugar", "g"],
            ["fat", "Fat", "g"],
            ["saturatedFat", "Saturated Fat", "g"],
            ["transFat", "Trans Fat", "g"],
            ["protein", "Protein", "g"],
            ["fiber", "Fiber", "g"],
            ["sodiumMg", "Sodium", "mg"],
          ].map(([field, label, unit]) => (

            <div key={field}>

              <label className="block text-gray-300 mb-2">
                {label}

                <span className="text-gray-500 ml-2">
                  ({unit})
                </span>
              </label>

              <input
                type="number"
                min="0"
                step="any"
                value={nutrition[field]}
                onChange={(e) =>
                  handleNutritionChange(
                    field,
                    e.target.value
                  )
                }
                placeholder="Enter value"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-emerald-500"
              />

            </div>

          ))}

        </div>

      </div>

      {/* Ingredients Image */}

      <div className="bg-gray-800 rounded-xl p-6">

        <h3 className="text-xl font-semibold text-white mb-3">
          Ingredients
        </h3>

        <p className="text-gray-400 mb-5">
          Upload a clear image of the ingredients panel.
        </p>

        <label
          className="border-2 border-dashed border-gray-600
          rounded-xl h-56 flex flex-col items-center
          justify-center cursor-pointer
          hover:border-emerald-500 transition"
        >

          <Upload className="w-12 h-12 text-gray-400 mb-4" />

          <p className="text-white font-medium text-center px-4">
            {ingredientsFile
              ? ingredientsFile.name
              : "Upload Ingredients Image"}
          </p>

          <p className="text-gray-400 text-sm mt-2">
            {ingredientsFile
              ? "Image selected successfully"
              : "JPG, JPEG, or PNG"}
          </p>

          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            capture="environment"
            className="hidden"
            onChange={handleIngredientsChange}
          />

        </label>

      </div>

      {/* Add Product Button */}
      {/* Extracted Ingredients Editor */}
{ocrCompleted && (
  <div className="bg-gray-800 rounded-xl p-6">
    <h3 className="text-xl font-semibold text-white mb-2">
      Review Extracted Ingredients
    </h3>
<p className="text-amber-300 bg-amber-500/10 border border-amber-500/40 rounded-lg px-4 py-3 text-sm font-bold mb-5">
  ⚠️ Important: Correct any OCR mistakes before continuing.
  Compare every ingredient with your package label.
</p>

{/* Decoded Ingredient Information */}
<div className="mb-6 space-y-3">
  <h4 className="text-white font-semibold">
    Ingredient Information
  </h4>

  {decodedIngredients.length === 0 ? (
    <p className="text-amber-300 text-sm">
      No decoded information is available yet.
      Check the ingredient names and try refreshing the information.
    </p>
  ) : (
    decodedIngredients.map((item, index) => (
      <div
        key={`${item.originalName}-${index}`}
        className="bg-gray-900 border border-gray-700 rounded-lg p-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h5 className="text-white font-semibold">
            {item.displayName || item.originalName}
          </h5>

          <span
  className={`text-xs font-semibold px-2 py-1 rounded ${
    item.verified
      ? "bg-emerald-900/40 text-emerald-300"
      : item.identified
      ? "bg-blue-900/40 text-blue-300"
      : "bg-amber-900/40 text-amber-300"
  }`}
>
  {item.verified
    ? "Verified reference"
    : item.identified
    ? "Matched — unverified"
    : "Needs review"}
</span>
        </div>

        <p className="text-gray-300 text-sm mt-2">
          <span className="font-semibold">Purpose: </span>
          {item.purpose || "Not available"}
        </p>

        <p className="text-gray-400 text-sm mt-1">
          {item.explanation || "No explanation available."}
        </p>

        {item.note && (
          <p className="text-amber-300 text-sm mt-2">
            {item.note}
          </p>
        )}
      </div>
    ))
  )}

  <button
    type="button"
    onClick={async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/ingredients/decode-batch",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ingredients }),
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error("Could not refresh ingredient information.");
        }

        setDecodedIngredients(data.results);
        setError("");
      } catch (err) {
        console.error("Ingredient refresh failed:", err);
        setError(
          "Could not refresh ingredient information. Please try again."
        );
      }
    }}
    className="border border-emerald-500 text-emerald-300 hover:bg-emerald-500/10 px-4 py-2 rounded-lg text-sm font-semibold"
  >
    Refresh Ingredient Information
  </button>
</div>


    <div className="space-y-3">
      {ingredients.map((ingredient, index) => (
        <div key={index}>
          <label className="block text-gray-300 text-sm mb-1">
            Ingredient {index + 1}
          </label>

          <input
            type="text"
            value={ingredient}
          onChange={(e) => {
  const updatedIngredients = [...ingredients];
  updatedIngredients[index] = e.target.value;

  setIngredients(updatedIngredients);
  setIngredientsText(updatedIngredients.join(", "));

  // Old explanations may no longer match the edited ingredients.
  setDecodedIngredients([]);
}}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-emerald-500"
          />
        </div>
      ))}
    </div>

    {ingredients.length === 0 && (
      <p className="text-orange-300">
        No ingredients were detected. Upload a clearer image.
      </p>
    )}

    <button
      type="button"
      onClick={() => {
        if (
          ingredients.length === 0 ||
          ingredients.some((item) => !item.trim())
        ) {
          setError("Please ensure all ingredients are detected and filled in.");
          return;
        }

        setError("");

        const product = {
          name: productName.trim(),
          brand: brand.trim(),
          category: category.trim() || "Packaged Food",
          nutrition: {
            basis: "100g",
            calories: nutrition.calories === "" ? null : Number(nutrition.calories),
            carbohydrates: nutrition.carbohydrates === "" ? null : Number(nutrition.carbohydrates),
            totalSugar: nutrition.totalSugar === "" ? null : Number(nutrition.totalSugar),
            addedSugar: nutrition.addedSugar === "" ? null : Number(nutrition.addedSugar),
            fat: nutrition.fat === "" ? null : Number(nutrition.fat),
            saturatedFat: nutrition.saturatedFat === "" ? null : Number(nutrition.saturatedFat),
            transFat: nutrition.transFat === "" ? null : Number(nutrition.transFat),
            protein: nutrition.protein === "" ? null : Number(nutrition.protein),
            fiber: nutrition.fiber === "" ? null : Number(nutrition.fiber),
            sodiumMg: nutrition.sodiumMg === "" ? null : Number(nutrition.sodiumMg),
          },
          ingredients,
          ingredientsText: ingredients.join(", "),
          additives: [],
          source: { name: "Manual" },
        };

       if (onProductConfirmed) {
  onProductConfirmed(product);
} else {
  setSelectedProduct(product);
}
      }}
      className="mt-6 bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg text-white font-semibold"
    >
      Confirm Ingredients & Continue
    </button>
  </div>
)}

      <button
        onClick={addProduct}
        disabled={isProcessing}
        className="bg-orange-500 hover:bg-orange-600
                   disabled:bg-gray-600 disabled:cursor-not-allowed
                   px-8 py-3 rounded-lg text-white
                   font-semibold"
      >
        {isProcessing
          ? "Processing Ingredients..."
          : "Add Product"}
      </button>

      {/* Error */}

      {error && (
        <p className="text-red-400 text-sm">
          {error}
        </p>
      )}

      {/* Guidelines */}

      <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-5">

        <div className="flex gap-3">

          <Camera className="text-blue-400 mt-1" />

          <div>

            <h3 className="text-white font-semibold mb-2">
              How to add a product
            </h3>

            <ul className="space-y-2 text-gray-300">

              <li>
                ✔ Enter the product name and brand
              </li>

              <li>
                ✔ Enter nutrition values per 100g
              </li>

              <li>
                ✔ Upload a clear ingredients image
              </li>

              <li>
                ✔ Make sure the package text is clearly visible
              </li>

            </ul>

          </div>

        </div>

      </div>

    </div>
  );
}

export default OCRTab;