import { useState } from "react";
import { Clock, RefreshCw, Check } from "lucide-react";

export default function PricingCard() {
  const [activeTab, setActiveTab] = useState("Basic");

  const pricingData = {
    Basic: {
      price: "Rp100.000",
      description: "Ideal for starters, this package provides essential features to get your project off the ground.",
      delivery: "4 Days Delivery",
      revisions: "1 Revision",
      features: ["Feature A", "Feature B", "Feature C"],
    },
    Standard: {
      price: "Rp250.000",
      description: "Perfect for growing businesses, offering more revisions and faster delivery to accelerate your progress.",
      delivery: "3 Days Delivery",
      revisions: "3 Revisions",
      features: ["All Basic Features", "Feature D", "Feature E", "Priority Support"],
    },
    Premium: {
      price: "Rp500.000",
      description: "The ultimate solution for professionals, with top-tier features, priority support, and unlimited revisions.",
      delivery: "2 Days Delivery",
      revisions: "Unlimited Revisions",
      features: ["All Standard Features", "Feature F", "24/7 Support", "Dedicated Manager"],
    },
  };

  const currentPlan = pricingData[activeTab];

  return (
    <div className="flex flex-col items-center p-4 w-full">
      {/* Tab Navigation */}
      <div className="flex border-b w-full max-w-sm md:max-w-md">
        {Object.keys(pricingData).map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-2 text-center font-semibold transition-colors duration-300 ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Pricing Card */}
      <div className="w-full max-w-sm md:max-w-md mt-6 border rounded-lg shadow-lg overflow-hidden bg-white">
        <div className="p-6">
          <div className="flex justify-between items-baseline">
            <h3 className="text-lg font-semibold text-gray-800 uppercase">{activeTab} Package</h3>
            <p className="text-2xl font-bold text-blue-600">
              {currentPlan.price}
            </p>
          </div>
          <p className="text-gray-600 text-sm mt-2 h-16">
            {currentPlan.description}
          </p>
          
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
              <Clock size={16} className="text-blue-500" />
              <span>{currentPlan.delivery}</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
              <RefreshCw size={16} className="text-blue-500" />
              <span>{currentPlan.revisions}</span>
            </div>
          </div>

          {/* Feature List */}
          <ul className="space-y-2 text-gray-700 mt-6">
            {currentPlan.features.map((item, index) => (
              <li key={index} className="flex items-center gap-3">
                <Check className="text-green-500" size={16} />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Buttons */}
          <button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-md font-semibold transition-transform transform hover:scale-105">
            Continue
          </button>
          <button className="w-full mt-3 bg-gray-100 text-gray-700 hover:bg-gray-200 py-2.5 px-4 rounded-md font-semibold border border-gray-300">
            Contact B-Partner
          </button>
        </div>
      </div>
    </div>
  );
}