import { useState } from "react";

import SearchTab from "./SearchTab";
import BarcodeTab from "../scanner/BarcodeTab";
import OCRTab from "../ocr/OCRTab";

function InputTabs({
  onAnalyze,
  setSelectedProduct,
  onProductConfirmed,
}) {
  const [activeTab, setActiveTab] = useState("search");
  const [searchFailed, setSearchFailed] = useState(false);
  const [barcodeFailed, setBarcodeFailed] = useState(false);

  const openAddProduct = () => {
    setActiveTab("ocr");
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setActiveTab("search")}
          className={`px-5 py-2 rounded-lg transition ${
            activeTab === "search"
              ? "bg-emerald-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Search
        </button>

        <button
          onClick={() => setActiveTab("barcode")}
          className={`px-5 py-2 rounded-lg transition ${
            activeTab === "barcode"
              ? "bg-emerald-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Barcode
        </button>

        <button
          onClick={openAddProduct}
          className={`px-5 py-2 rounded-lg transition ${
            activeTab === "ocr"
              ? "bg-emerald-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Add Product
        </button>
      </div>

      {/* Active Tab Content */}
      <div className="bg-gray-900 rounded-xl p-6">
        {activeTab === "search" && (
          <SearchTab
            setSelectedProduct={setSelectedProduct}
            onSearchResult={setSearchFailed}
          />
        )}

        {activeTab === "barcode" && (
          <BarcodeTab
            setSelectedProduct={setSelectedProduct}
            onBarcodeResult={setBarcodeFailed}
          />
        )}

        {activeTab === "ocr" && (
          <OCRTab
            setSelectedProduct={setSelectedProduct}
            onProductConfirmed={onProductConfirmed}
          />
        )}
      </div>

      {/* Search Failure Message */}
      {searchFailed && activeTab === "search" && (
        <div className="mt-6 bg-gray-800 border border-orange-500/40 rounded-lg p-5">
          <h3 className="text-xl font-semibold text-orange-400">
            Product Not Found
          </h3>

          <p className="text-gray-400 mt-2">
            This product was not found using Name Search.
            Please try searching by Barcode or add it manually.
          </p>

          <button
            onClick={openAddProduct}
            className="mt-4 px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
          >
            Add Product Manually
          </button>
        </div>
      )}

      {/* Barcode Failure Message */}
      {barcodeFailed && activeTab === "barcode" && (
        <div className="mt-6 bg-gray-800 border border-orange-500/40 rounded-lg p-5">
          <h3 className="text-xl font-semibold text-orange-400">
            Product Not Found
          </h3>

          <p className="text-gray-400 mt-2">
            This product was not found using the Barcode.
            You can add it manually using the Add Product tab.
          </p>

          <button
            onClick={openAddProduct}
            className="mt-4 px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
          >
            Add Product Manually
          </button>
        </div>
      )}

      {/* Manual Entry Option After Search or Barcode */}
      {(activeTab === "search" || activeTab === "barcode") && (
        <div className="mt-6 bg-gray-800 border border-gray-700 rounded-lg p-5">

          <p className="text-gray-400 mt-2">
            If the product information above is incorrect, displayed in the
            wrong language, or missing ingredients, you can add the correct
            product manually.
          </p>

          <button
            onClick={openAddProduct}
            className="mt-4 px-5 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition"
          >
            Add Product Manually
          </button>
        </div>
      )}

{/* Analyze Instructions */}
{(activeTab === "search" || activeTab === "barcode") && (
  <p className="mt-6 text-center text-emerald-400">
    If this is the correct product, click "Analyze Product" below
    to continue with your food safety analysis.
  </p>
)}

{/* Universal Analyze Button */}
<div className="mt-4 flex justify-center">
        <button
          onClick={onAnalyze}
          className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-300
                     px-10 py-4 rounded-xl text-white text-lg font-semibold
                     shadow-lg hover:shadow-emerald-500/40"
        >
          Analyze Product
        </button>
      </div>
    </div>
  );
}

export default InputTabs;