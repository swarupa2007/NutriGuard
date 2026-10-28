import { useState } from "react";
import users from "./data/users";

import Header from "./components/layout/Header";
import Sidebar from "./components/profile/Sidebar";
import MainWorkspace from "./components/main/MainWorkspace";
import AIProcessing from "./components/loading/AIProcessing";
import ResultDashboard from "./components/dashboard/ResultDashboard";

function App() {

  const [selectedUser, setSelectedUser] = useState(users[0]);
 const [selectedProduct, setSelectedProduct] = useState(null);
  const [conditions, setConditions] = useState({
    diabetes: false,
    hypertension: false,
    celiac: false,
    vegan: false,
    lactose: false,
    avoidAdditives: false,
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900">

      <Header />

      <div className="flex">

        <Sidebar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          conditions={conditions}
          setConditions={setConditions}
        />

        {showResults ? (

          <ResultDashboard
  selectedUser={selectedUser}
  conditions={conditions}
      selectedProduct={selectedProduct}
/>

        ) : isAnalyzing ? (

          <AIProcessing
            onComplete={() => {
              setIsAnalyzing(false);
              setShowResults(true);
            }}
          />

        ) : (
<MainWorkspace
  onAnalyze={() => {
    setShowResults(false);
    setIsAnalyzing(true);
  }}
  setSelectedProduct={setSelectedProduct}
  onProductConfirmed={(product) => {
    setSelectedProduct(product);
    setShowResults(false);
    setIsAnalyzing(true);
  }}
/>

        )}

      </div>

    </div>
  );
}

export default App;