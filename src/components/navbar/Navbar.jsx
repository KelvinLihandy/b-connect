import { useContext, useState } from "react";
import { Bell, Heart, Users, MessageCircle, ShoppingBag, Search } from "lucide-react";
import { Switch } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import bell from "../../assets/bell_icon.svg";
import heart from "../../assets/heart_icon.svg";
import message from "../../assets/message_icon.svg";
import people from "../../assets/people_icon.svg";
import order from "../../assets/order_icon.svg";
import searchBtn from "../../assets/search_btn.svg";
import default_avatar from "../../assets/default-avatar.png"
import logo from "../../assets/logo.svg";
import Logo from "../../assets/logo.svg";
import { AuthContext } from "../../contexts/AuthContext";

const Navbar = ({ search = false }) => {
  const [enabled, setEnabled] = useState(false);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav
      className="flex items-center justify-between text-white p-4 shadow-md"
      style={{ backgroundColor: "#2f5379" }}
    >
      {/* Logo */}
      <div className="flex items-center ml-15 cursor-pointer"
        onClick={() => { auth ? navigate("/catalog") : navigate("/home") }}
      >
        <img src={Logo} alt="Logo" className="w-25 h-15" />
      </div>

      {search &&
        <div className="relative flex items-center w-[550px] h-[50px] bg-[#FFFFFF] rounded-[14px] overflow-visible">
          <input
            type="text"
            placeholder="Search For Our Services"
            className="relative left-3 w-full h-[40px] px-4 rounded-[14px] border-black outline-none text-black text-sm"
          />
          <button className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-[14px] flex justify-center outline-none items-center cursor-pointer">
            <img src={searchBtn} alt="Search" className="w-[83px] h-[64px]" />
          </button>
        </div>
      }

      {/* Icons and Buttons */}
      <div className="flex items-center gap-6 text-white">
        <div className="relative cursor-pointer">
          <img src={bell} alt="Notifications" className="w-7 h-7" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>

        {/* Order Button */}
        <button className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold">Order</button>

        {/* User Toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            checked={enabled}
            onChange={auth?.data?.auth?.access ? setEnabled : null}
            className={`${enabled ? "bg-blue-600" : "bg-[#212861]"
              } relative inline-flex h-13 w-40 items-center rounded-full p-1`}
          >
            <span className={`absolute inset-0 flex items-center ${enabled ? "justify-end pr-6" : "justify-center"} text-lg font-medium text-white`}>
              {enabled ? "Freelancer" : "User"}
            </span>
            <span
              className={`${enabled ? "translate-x-[4px]" : "translate-x-28"
                } inline-block h-8 w-8 transform bg-white rounded-full transition`}
            />
          </Switch>
        </div>

        <div className="relative w-[40px] h-[40px] bg-black rounded-full flex items-center justify-center cursor-pointer">
          {auth?.data?.auth ? (
            <img
              src={auth.data.auth.picture === "temp" ? default_avatar : auth.data.auth.picture}
              alt="profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <img
              src={default_avatar}
              alt="default profile"
              className="w-full h-full object-cover rounded-full"
            />
          )}
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;