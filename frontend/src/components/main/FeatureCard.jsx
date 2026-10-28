import { ArrowRight } from "lucide-react";

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-emerald-500 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-emerald-500/20">

      <div className="mb-4">
        {icon}
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">
        {title}
      </h3>

      <p className="text-gray-400 mb-6">
        {description}
      </p>

      <div className="flex items-center text-emerald-400 font-medium">
        Open
        <ArrowRight className="ml-2 w-4 h-4" />
      </div>

    </div>
  );
}

export default FeatureCard;