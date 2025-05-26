import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import gsap from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { socket } from "../../App";

// Import assets
import bell from "../../assets/bell_icon.svg";
import searchBtn from "../../assets/search_btn.svg";
import default_avatar from "../../assets/default-avatar.png";
import logo from "../../assets/logo.svg";
import login_logo from '../../assets/login_logo.svg';
import dropdown_tri from '../../assets/dropdown_tri.svg';
import { imageShow } from "../../constants/DriveLinkPrefixes";
import MorphToggleButton from "../../components/togglebutton/togglebutton";
import { NotificationContext } from "../../contexts/NotificationContext";
import NotificationItem from "../notification_item/NotificationItem";
import { CircularProgress } from '@mui/material'
import { UserTypeContext } from "../../contexts/UserTypeContext";
import axios from "axios";
import { authAPI } from "../../constants/APIRoutes";

gsap.registerPlugin(MorphSVGPlugin);

const Navbar = ({ search = false, alt = false, setSearchQuery = null }) => {
  const { isFreelancer, setIsFreelancer } = useContext(UserTypeContext);
  const { auth, setAuth } = useContext(AuthContext);
  const { notificationList } = useContext(NotificationContext);
  const navigate = useNavigate();
  const location = useLocation();

  const list = Array.isArray(notificationList)
    ? notificationList
    : Object.values(notificationList || {});

  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    const list = Array.isArray(notificationList)
      ? notificationList
      : Object.values(notificationList || {});
    setUnreadCount(list.filter(n => n && !n.read).length)
  }, [notificationList]);

  const handleClickOutside = (event) => {
    const isNotificationClick = event.target.closest('.notification-dropdown') ||
      event.target.closest('[data-notification-trigger]');
    const isUserClick = event.target.closest('.user-dropdown') ||
      event.target.closest('[data-user-trigger]');

    if (!isNotificationClick && showNotificationDropdown) {
      setShowNotificationDropdown(false);
    }
    if (!isUserClick && showUserDropdown) {
      setShowUserDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotificationDropdown, showUserDropdown]);

  const getRelativeDateLabel = (time) => {
    const messageDate = new Date(time);
    const now = new Date();
    const messageMidnight = new Date(messageDate);
    messageMidnight.setHours(0, 0, 0, 0);
    const nowMidnight = new Date(now);
    nowMidnight.setHours(0, 0, 0, 0);
    const diffTime = nowMidnight - messageMidnight;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays === 2) return "2 days ago";
    return messageDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  let lastRenderedDate = null;

  return (
    <>
      {(auth || alt) && (
        <div
          className="fixed top-0 left-0 w-full h-[100px] z-30"
          style={{ backgroundColor: "#2f5379" }}
        />
      )}

      {auth ? (
        <motion.nav
          className="fixed top-0 left-0 w-full z-40 flex items-center justify-between text-white p-4 shadow-md h-[100px]"
          style={{ backgroundColor: "#2f5379" }}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div
            className="flex items-center ml-15 cursor-pointer w-1/10"
            onClick={() => {
              if (isFreelancer) navigate(`/freelancer-profile/${auth?.data?.auth?.id}`);
              else navigate("/home")
            }}
          >
            <motion.img
              src={logo}
              alt="Logo"
              className="w-25 h-15"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </div>
          <div className="w-6/10">
            {search && !isFreelancer && (
              <div className="relative flex items-center w-130 h-14 bg-white rounded-[14px] overflow-visible">
                <input
                  type="text"
                  placeholder="Search For Our Services"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="relative left-3 w-full h-[40px] px-3 rounded-lg border-black outline-none text-black text-base font-medium"
                />
                <button className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-lg flex justify-center outline-none items-center cursor-pointer">
                  <img src={searchBtn} alt="Search" className="w-full h-full" />
                </button>
              </div>
            )}
            {isFreelancer && (
              <div className="flex items-center gap-8">
                <motion.p
                  className="inline-block text-xl cursor-pointer transition-colors duration-300 font-bold"
                  whileHover={{ scale: 1.1 }}
                  onClick={() => { navigate(`/freelancer-profile/${auth?.data?.auth?.id}`) }}
                >
                  Dashboard
                </motion.p>
                <motion.p
                  className="inline-block text-xl cursor-pointer transition-colors duration-300 font-bold"
                  whileHover={{ scale: 1.1 }}
                  onClick={() => { navigate(`/freelancer-orders`) }}
                >
                  Orders
                </motion.p>
              </div>
            )}
          </div>
          <div className="w-3/10 flex justify-end">
            <motion.div className="flex items-center gap-6 text-white">
              <div className="relative w-11">
                <div className="cursor-pointer w-12">
                  <motion.img
                    src={bell}
                    alt="Notifications"
                    className="w-10 h-10"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNotificationDropdown(!showNotificationDropdown);
                    }}
                    data-notification-trigger
                  />
                  {unreadCount > 0 && (
                    <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full text-white font-bold text-xs flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </div>
                  )}
                </div>
                <AnimatePresence>
                  {showNotificationDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-15 left-1/2 mt-2 w-120 transform -translate-x-1/2 bg-white rounded-lg shadow-lg z-[99998] overflow-hidden notification-dropdown"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#2E5077] to-[#4391b0]">
                        <h3 className="font-semibold text-white text-xl">Notifikasi</h3>
                        {unreadCount > 0 && (
                          <motion.span
                            className="text-sm text-white cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => socket.emit("read_all_notification", auth?.data?.auth?.id)}
                          >
                            Mark all as read
                          </motion.span>
                        )}
                      </div>

                      <div className="max-h-96 overflow-y-auto">
                        {notificationList && notificationList.length > 0 ? (
                          <motion.div initial="hidden" animate="visible">
                            {notificationList.map((notification, index) => {
                              if (!notification) return null;

                              const messageDate = new Date(notification.message.time);
                              const messageMidnight = new Date(messageDate);
                              messageMidnight.setHours(0, 0, 0, 0);

                              let showDateLabel = false;

                              if (!lastRenderedDate || messageMidnight.getTime() !== lastRenderedDate.getTime()) {
                                showDateLabel = true;
                                lastRenderedDate = messageMidnight;
                              }

                              const label = showDateLabel ? getRelativeDateLabel(notification.message.time) : null;

                              return (
                                <React.Fragment key={notification._id}>
                                  {label && (
                                    <div className="text-black font-Archivo p-3 text-lg font-semibold">
                                      {label}
                                    </div>
                                  )}
                                  <NotificationItem notification={notification} unreadCount={unreadCount} setUnreadCount={setUnreadCount} />
                                </React.Fragment>
                              );
                            })}
                          </motion.div>
                        ) : (
                          <motion.div
                            className="p-8 text-center text-gray-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            No notifications yet
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {!isFreelancer &&
                <motion.button className="bg-white text-l text-blue-900 px-7 py-3 rounded-lg font-semibold cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/catalog")}
                >
                  Order
                </motion.button>
              }

              <MorphToggleButton
                isFreelancer={isFreelancer}
                setIsFreelancer={setIsFreelancer}
              />

              <motion.div
                className="relative w-[40px] h-[40px] bg-black rounded-full flex items-center justify-center cursor-pointer mr-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserDropdown(prev => !prev);
                }}
                data-user-trigger
              >
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full h-full object-cover rounded-full"
                  src={auth?.data?.auth?.picture === "temp"
                    ? default_avatar
                    : `${imageShow}${auth?.data?.auth.picture}`}
                  alt="profile"
                  onLoad={() => setImageLoading(false)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = default_avatar;
                    console.log("Image load failed for freelancer:", auth?.data?.auth?.id);
                  }}
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
                <AnimatePresence>
                  {showUserDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-[99999]"
                      onClick={(e) => e.stopPropagation()}
                      style={{ position: 'absolute', zIndex: 99999 }}
                    >
                      <div className="py-2 px-4 border-b border-gray-100 cursor-default">
                        <p className="text-gray-800 font-medium">{auth?.data?.auth?.name || "User"}</p>
                        <p className="text-gray-500 text-xs">{auth?.data?.auth?.email}</p>
                      </div>

                      <div className="py-1">
                        {isFreelancer ? (
                          <>
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate(`/freelancer-profile/${auth?.data?.auth?.id}`);
                                setShowUserDropdown(false);
                              }}
                            >
                              My Freelancer Profile
                            </button>
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate(`/freelancer-gigs/create`);
                                setShowUserDropdown(false);
                              }}
                            >
                              Create New Gig
                            </button>
                          </>
                        ) : (
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate(`/user-profile/${auth?.data?.auth?.id}`);
                              setShowUserDropdown(false);
                            }}
                          >
                            My Profile
                          </button>
                        )}

                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(`/profile`);
                            setShowUserDropdown(false);
                          }}
                        >
                          Settings
                        </button>

                        <div className="border-t border-gray-100 my-1"></div>

                        <button
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            localStorage.clear();
                            sessionStorage.clear();
                            document.cookie.split(";").forEach((cookie) => {
                              const name = cookie.split("=")[0].trim();
                              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
                            });
                            await axios.post(`${authAPI}/clear-cookie`,
                              {},
                              { withCredentials: true }
                            )
                            setAuth(null);
                            setIsFreelancer(false);
                            navigate('/home');
                            setShowUserDropdown(false);
                          }}
                        >
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
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
          {search && (
            <div className="relative flex items-center w-[550px] h-[50px] bg-white rounded-[14px] overflow-visible">
              <input
                type="text"
                placeholder="Search For Our Services"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="relative left-3 w-full h-[40px] px-3 rounded-[14px] border-black outline-none text-black text-base font-medium"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-[14px] flex justify-center outline-none items-center cursor-pointer">
                <img src={searchBtn} alt="Search" className="w-[83px] h-[64px]" />
              </button>
            </div>
          )}
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