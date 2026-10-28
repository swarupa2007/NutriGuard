import { useState } from "react";

function SearchTab({ setSelectedProduct,onSearchResult }) {

  const [productName, setProductName] = useState("");
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  const searchProduct = async () => {

    if (!productName.trim()) {
      setError("Please enter a product name.");
      setProduct(null);
      setSelectedProduct(null);
        onSearchResult(false);
      return;

    }

    try {

      const response = await fetch(
        `http://localhost:5000/api/products/search?name=${encodeURIComponent(productName)}`
      );

      if (!response.ok) {
        throw new Error("Product not found");
      }

      const data = await response.json();

      setProduct(data);
      setSelectedProduct(data);
      onSearchResult(false);
      setError("");
      console.log("PRODUCT FROM BACKEND:", data);
      console.log("SETTING SELECTED PRODUCT");
      console.log("Product found:", data);

    } catch (error) {

      setProduct(null);
      setSelectedProduct(null);
      onSearchResult(true);
      setError("Product not found.");

    }
  };

  return (
    <div className="space-y-6">

      <div>

        <label className="block text-gray-300 mb-2">
          Product Name
        </label>

        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Search any packaged food..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-emerald-500"
        />

      </div>

      <div className="text-sm text-gray-400">

        Example:
        <span className="text-emerald-400">
          {" "}
          Maggi, Coca Cola, Oreo
        </span>

      </div>

      <button
        onClick={searchProduct}
        className="bg-emerald-500 hover:bg-emerald-600 px-8 py-3 rounded-lg text-white font-semibold"
      >
        Search Product
      </button>

      {error && (
        <p className="text-red-400">
          {error}
        </p>
      )}

      {product && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">

          <h3 className="text-xl font-semibold text-white">
            {product.name}
          </h3>

          <p className="text-gray-400 mt-1">
            {product.description}
          </p>

          <p className="text-gray-300 mt-3">
            Ingredients: {product.ingredients.join(", ")}
          </p>

        </div>
      )}

    </div>
  );
}

export default SearchTab;