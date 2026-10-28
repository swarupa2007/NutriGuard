import { useState } from "react";
import { ScanLine } from "lucide-react";

function BarcodeTab({ setSelectedProduct, onBarcodeResult }) {

  const [barcode, setBarcode] = useState("");
  const [error, setError] = useState("");
  const [product, setProduct] = useState(null);

  const searchBarcode = async () => {

    if (!barcode.trim()) {
  setError("Please enter a barcode.");
  setProduct(null);
  setSelectedProduct(null);
  onBarcodeResult(true);
  return;
}

    try {

      const response = await fetch(
        `http://localhost:5000/api/products/barcode/${barcode}`
      );

      if (!response.ok) {
        throw new Error("Product not found");
      }

      const data = await response.json();

     setProduct(data);
setSelectedProduct(data);
onBarcodeResult(false);
setError("");

    } catch (error) {

      setProduct(null);
      onBarcodeResult(true);
      setSelectedProduct(null);
      setError("Product not found.");

    }
  };

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold text-white">
        Barcode Scanner
      </h2>

      {/* Camera Mockup */}

      <div className="relative h-64 bg-gray-800 rounded-xl border border-gray-700 flex items-center justify-center overflow-hidden">

        <ScanLine className="w-16 h-16 text-gray-500" />

        <div className="scan-line"></div>

      </div>

      {/* Barcode Input */}

      <div>

        <label className="block text-gray-300 mb-2">
          Enter Barcode
        </label>

        <input
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="3017620422003"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-emerald-500 outline-none"
        />

      </div>

      <p className="text-gray-400 text-sm">

        Example:
        <span className="text-emerald-400">
          {" "}
          3017620422003
        </span>

      </p>

      {/* Search Button */}

      <button
        onClick={searchBarcode}
        className="bg-emerald-500 hover:bg-emerald-600 px-8 py-3 rounded-lg text-white font-semibold"
      >
        Search Barcode
      </button>

      {/* Error */}

      {error && (
        <p className="text-red-400">
          {error}
        </p>
      )}

      {/* Product Preview */}

      {product && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">

          <h3 className="text-xl font-semibold text-white">
            {product.name}
          </h3>

          <p className="text-gray-400 mt-1">
            {product.brands}
          </p>

          <p className="text-gray-300 mt-3">
            Barcode: {product.barcode}
          </p>

        </div>
      )}

    </div>
  );
}

export default BarcodeTab;