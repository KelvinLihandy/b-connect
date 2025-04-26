import React, { useState } from "react";
import { Switch } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import bell from "../../assets/bell_icon.svg";
import heart from "../../assets/heart_icon.svg";
import message from "../../assets/message_icon.svg";
import people from "../../assets/people_icon.svg";
import order from "../../assets/order_icon.svg";
import search from "../../assets/search_btn.svg";
import logo from "../../assets/logo.svg";

export default function Navbar() {
  const [enabled, setEnabled] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="font-poppins absolute top-0 left-0 w-full bg-[#2F5379] z-50 backdrop-blur-xs p-4 flex flex-row justify-between items-center px-10 h-[100px]">
      {/* Logo */}
      <img
        src={logo}
        alt="Logo"
        className="w-[114px] h-[80px] cursor-pointer"
        onClick={() => navigate("/home")} // Navigasi ke halaman home
      />

      {/* Search Bar */}
      <div className="relative flex items-center w-[550px] h-[50px] bg-[#FFFFFF] rounded-[14px] overflow-visible">
        <input
          type="text"
          placeholder="Search For Freelancers Or Services"
          className="relative left-3 w-full h-[40px] px-4 rounded-[14px] border-black outline-none text-black text-sm"
        />
        <button className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-[14px] flex justify-center outline-none items-center cursor-pointer">
          <img src={search} alt="Search" className="w-[83px] h-[64px]" />
        </button>
      </div>

      {/* Icons and Buttons */}
      <div className="flex items-center gap-6 text-white">
        <div className="relative cursor-pointer">
          <img src={bell} alt="Notifications" className="w-7 h-7" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>

        <img src={heart} alt="Favorites" className="w-7 h-7 cursor-pointer" />

        <img src={people} alt="Group" className="w-9 h-9 cursor-pointer" />

        <img src={message} alt="Chat" className="w-7 h-7 cursor-pointer" />

        <button className="flex border border-white rounded-[14px] px-4 py-2 text-sm justify-center items-center gap-2 cursor-pointer">
          <img src={order} alt="" className="w-6 h-6" />
          Order
        </button>

        {/* Switch (Freelancer & User) */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-[29px]">
          <Switch
            checked={enabled}
            onChange={setEnabled}
            className={`${
              enabled ? "bg-gray-400" : "bg-white"
            } relative inline-flex w-35 items-center gap-2 px-4 py-1 items-center rounded-[29px] transition-colors cursor-pointer`}
          >
            <span
              className={`${
                enabled ? "translate-x-[6rem]" : "translate-x-1"
              } relative -left-3 w-8 h-8 bg-blue-500 rounded-full transition-transform`}
            />
            <span
              className={`absolute   ${
                enabled ? "text-white left-3" : "text-[#404041] right-9"
              }`}
            >
              {enabled ? "Freelancer" : "User"}
            </span>
          </Switch>
        </div>

        <div className="relative w-[40px] h-[40px] bg-black rounded-full flex items-center justify-center cursor-pointer">
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
        </div>
      </div>
    </nav>
  );
}
