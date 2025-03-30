import { useState } from "react";
import { Clock, RefreshCw, Check } from "lucide-react";

export default function PricingCard() {
  const [activeTab, setActiveTab] = useState("Basic");

  return (
    <div className="flex flex-col items-center p-4">
      {/* Tab Navigation */}
      <div className="flex border-b w-full max-w-sm">
        {["Basic", "Standard"].map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-2 text-center font-semibold ${
              activeTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Pricing Card */}
      <div className="w-full max-w-sm mt-4 border rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold">BASIC PROMO</h3>
          <p className="text-xl font-bold">Rp100.000</p>
          <p className="text-gray-600 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
          </p>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Clock size={16} />
              4 Days Delivery
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <RefreshCw size={16} />
              1 Revision
            </div>
          </div>

          {/* Feature List */}
          <ul className="space-y-1 text-gray-700 mt-4">
            {Array(5).fill("Lorem").map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <Check className="text-green-500" size={16} />
                {item}
              </li>
            ))}
          </ul>

          {/* Buttons */}
          <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium">
            Continue
          </button>
          <button className="w-full mt-2 bg-gray-200 text-gray-700 hover:bg-gray-300 py-2 px-4 rounded-md font-medium">
            Contact B-Partner
          </button>
        </div>
      </div>
    </div>
  );
}