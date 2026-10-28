function HealthMatrix({ conditions, setConditions }) {

  const handleToggle = (condition) => {
    setConditions({
      ...conditions,
      [condition]: !conditions[condition],
    });
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4">

      <h3 className="text-white text-lg font-semibold mb-4">
        Preferences
      </h3>

      <div className="space-y-3">

        <label className="flex items-center gap-3 text-gray-300">
          <input
            type="checkbox"
            checked={conditions.diabetes}
            onChange={() => handleToggle("diabetes")}
          />
          Diabetes
        </label>

        <label className="flex items-center gap-3 text-gray-300">
          <input
            type="checkbox"
            checked={conditions.hypertension}
            onChange={() => handleToggle("hypertension")}
          />
          Hypertension
        </label>

        <label className="flex items-center gap-3 text-gray-300">
          <input
            type="checkbox"
            checked={conditions.celiac}
            onChange={() => handleToggle("celiac")}
          />
          Allergy to gluten
        </label>

        <label className="flex items-center gap-3 text-gray-300">
          <input
            type="checkbox"
            checked={conditions.vegan}
            onChange={() => handleToggle("vegan")}
          />
          Vegan
        </label>

        <label className="flex items-center gap-3 text-gray-300">
          <input
            type="checkbox"
            checked={conditions.lactose}
            onChange={() => handleToggle("lactose")}
          />
          Lactose Intolerance
        </label>

        <label className="flex items-center gap-3 text-gray-300">
          <input
            type="checkbox"
            checked={conditions.avoidAdditives}
            onChange={() => handleToggle("avoidAdditives")}
          />
          Avoid Artificial Additives
        </label>

      </div>
    </div>
  );
}

export default HealthMatrix;