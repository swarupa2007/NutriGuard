function Header() {
  return (
    <header className="bg-gray-950 border-b border-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Left Section */}
        <div className="flex items-center gap-3">

          <div className="bg-emerald-500 text-white p-2 rounded-lg text-xl">
            🛡️
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">
              NutriGuard
            </h1>

            <p className="text-sm text-gray-400">
              Personalized Packaged Food Safety Analyzer
            </p>
          </div>

        </div>

      </div>
    </header>
  );
}

export default Header;