import { useEffect } from "react";
import { Brain, CheckCircle, LoaderCircle } from "lucide-react";
function AIProcessing({ onComplete }) {
      useEffect(() => {

    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => clearTimeout(timer);

  }, [onComplete]);
  return (
    <div className="flex-1 p-8">

      <div className="max-w-3xl mx-auto">

        {/* Header */}

        <div className="text-center mb-10">

          <div className="flex justify-center mb-4">

            <div className="bg-emerald-500/10 p-4 rounded-full">

              <Brain className="w-12 h-12 text-emerald-400" />

            </div>

          </div>

          <h1 className="text-3xl font-bold text-white">
            NutriGuard AI is analyzing your product
          </h1>

          <p className="text-gray-400 mt-2">
            Please wait while we process the product information.
          </p>

        </div>

        {/* Processing Steps */}

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">

          {/* Step 1 */}

          <div className="flex items-center gap-4">

            <CheckCircle className="text-emerald-400 w-6 h-6" />

            <span className="text-gray-200">
              Reading user profile
            </span>

          </div>

          {/* Step 2 */}

          <div className="flex items-center gap-4">

            <CheckCircle className="text-emerald-400 w-6 h-6" />

            <span className="text-gray-200">
              Finding product information
            </span>

          </div>

          {/* Step 3 */}

          <div className="flex items-center gap-4">

            <LoaderCircle className="text-emerald-400 w-6 h-6 animate-spin" />

            <span className="text-white font-medium">
              Extracting ingredients
            </span>

          </div>

          {/* Step 4 */}

          <div className="flex items-center gap-4">

            <LoaderCircle className="text-gray-600 w-6 h-6" />

            <span className="text-gray-500">
              Checking artificial additives
            </span>

          </div>

          {/* Step 5 */}

          <div className="flex items-center gap-4">

            <LoaderCircle className="text-gray-600 w-6 h-6" />

            <span className="text-gray-500">
              Comparing with health profile
            </span>

          </div>

          {/* Step 6 */}

          <div className="flex items-center gap-4">

            <LoaderCircle className="text-gray-600 w-6 h-6" />

            <span className="text-gray-500">
              Generating health recommendation
            </span>

          </div>

        </div>

        {/* Bottom Message */}

        <p className="text-center text-gray-500 text-sm mt-6">
          NutriGuard is preparing your personalized food safety report.
        </p>

      </div>

    </div>
  );
}

export default AIProcessing;