import InputTabs from "../search/InputTabs";

function MainWorkspace({
  onAnalyze,
  setSelectedProduct,
  onProductConfirmed,
}) {
  return (
    <main className="flex-1 p-8">
      <h1 className="text-4xl font-bold text-white">
        Analyze Food Product
      </h1>

      <p className="text-gray-400 mt-2 mb-8">
        Choose how you'd like to analyze your food product.
      </p>

      <InputTabs
        onAnalyze={onAnalyze}
        setSelectedProduct={setSelectedProduct}
        onProductConfirmed={onProductConfirmed}
      />
    </main>
  );
}

export default MainWorkspace;