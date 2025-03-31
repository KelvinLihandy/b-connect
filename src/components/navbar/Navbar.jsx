import { useState } from "react";
import { Bell, Heart, Users, MessageCircle, ShoppingBag, Search } from "lucide-react";
import { Switch } from "@headlessui/react";
import Logo from "../../assets/logo.svg";


export default function Navbar() {
  const [enabled, setEnabled] = useState(false);

  return (
    <nav className="flex items-center justify-between bg-blue-900 text-white p-4 shadow-md">
      {/* Logo */}
      <div className="flex items-center ml-15">
        <img src={Logo} alt="Logo" className="w-25 h-15" />
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-white rounded-lg px-4 py-2 w-1/3">
        <input
          type="text"
          placeholder="Search For Freelancers Or Services"
          className="w-full outline-none text-black"
        />
        <Search className="text-blue-500" />
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-4">
        <Bell className="w-6 h-6 text-white relative" />
        <Heart className="w-6 h-6 text-white" />
        <Users className="w-6 h-6 text-white" />
        <MessageCircle className="w-6 h-6 text-white" />
      </div>

      {/* Order Button */}
      <button className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold">Order</button>

 {/* User Toggle */}
 <div className="flex items-center space-x-2">
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={`${enabled ? "bg-blue-600" : "bg-gray-400"} relative inline-flex h-13 w-35 items-center rounded-full p-1`}
        >
          <span className="absolute inset-0 flex items-center justify-center text-lg font-medium text-white">
            {enabled ? "Freelancer" : "User"}
          </span>
          <span
            className={`${enabled ? "translate-x-[4px]" : "translate-x-23"} inline-block h-8 w-8 transform bg-white rounded-full transition`}
          />
        </Switch>
      </div>

      {/* Profile Avatar */}
      <div className="relative">
        <div className="w-10 h-10 bg-black rounded-full mr-10" />
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white mr-10"></span>
      </div>
    </nav>
  );
}
