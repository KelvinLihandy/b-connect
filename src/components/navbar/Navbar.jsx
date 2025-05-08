import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

// Import assets
import bell from "../../assets/bell_icon.svg";
import searchBtn from "../../assets/search_btn.svg";
import default_avatar from "../../assets/default-avatar.png";
import logo from "../../assets/logo.svg";
import login_logo from '../../assets/login_logo.svg';
import dropdown_tri from '../../assets/dropdown_tri.svg';
import { imageShow } from "../../constants/DriveLinkPrefixes";

// Import custom components
import MorphToggleButton from "../../components/togglebutton/togglebutton";

// Register GSAP plugins
gsap.registerPlugin(MorphSVGPlugin);

const Navbar = ({ search = false, alt = false }) => {
  const [isFreelancer, setIsFreelancer] = useState(false);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle mode toggle
  const toggleMode = () => {
    setIsFreelancer(prev => !prev);
  };

  return (
    <>
      {/* Background filler to prevent animation gap */}
      {(auth || alt) && (
        <div
          className="fixed top-0 left-0 w-full h-[100px] z-40"
          style={{ backgroundColor: "#2f5379" }}
        />
      )}

      {auth ? (
        <motion.nav
          className="fixed top-0 left-0 w-full z-50 flex items-center justify-between text-white p-4 shadow-md h-[100px]"
          style={{ backgroundColor: "#2f5379" }}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div
            className="flex items-center ml-15 cursor-pointer"
            onClick={() => navigate("/home")}
          >
            <motion.img
              src={logo}
              alt="Logo"
              className="w-25 h-15"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </div>

          {search && (
            <div className="relative flex items-center w-[550px] h-[50px] bg-white rounded-[14px] overflow-visible">
              <input
                type="text"
                placeholder="Search For Our Services"
                className="relative left-3 w-full h-[40px] px-3 rounded-[14px] border-black outline-none text-black text-md font-medium"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-[14px] flex justify-center outline-none items-center cursor-pointer">
                <img src={searchBtn} alt="Search" className="w-[83px] h-[64px]" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-6 text-white">
            <div className="relative cursor-pointer">
              <img src={bell} alt="Notifications" className="w-7 h-7" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>

            <button className="bg-white text-l text-blue-900 px-7 py-3 rounded-lg font-semibold">Order</button>

            {/* Morph Toggle Button */}
            <MorphToggleButton />

            <div className="relative w-[40px] h-[40px] bg-black rounded-full flex items-center justify-center cursor-pointer mr-10">
              <img
                src={auth?.data?.auth?.picture === "temp" ? default_avatar : `${imageShow}${auth.data.auth.picture}`}
                alt="profile"
                className="w-full h-full object-cover rounded-full"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
            </div>
          </div>
        </motion.nav>
      ) : (
        <motion.header
          className={`fixed top-0 left-0 w-full z-50 p-4 flex flex-row justify-between px-25 h-[100px] shadow-sm ${alt ? "text-white" : "bg-white/10 backdrop-blur-md text-white"}`}
          style={alt ? { backgroundColor: "#2f5379" } : {}}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <motion.img
            src={logo}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="cursor-pointer"
            onClick={() => navigate("/home")}
          />
          <div className="flex flex-row items-center gap-8 text-xl">
            <motion.p
              className="flex flex-row items-center gap-2 cursor-pointer hover:text-blue-300 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
            >
              Explore <span><img className="self-center" src={dropdown_tri} alt="" /></span>
            </motion.p>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link to="/about-us" className="hover:text-blue-300 transition-colors duration-300">About Us</Link>
            </motion.div>
            <motion.button
              className="flex flex-row border border-white/30 rounded-xl py-4 px-6 gap-2 items-center hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/sign-in")}
            >
              Login
              <span>
                <img className="h-5 self-center" src={login_logo} alt="Login" />
              </span>
            </motion.button>
          </div>
        </motion.header>
      )}
    </>
  );
};

export default Navbar;