import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import gsap from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { socket } from "../../App";

// Import assets
import message from "../../assets/message_icon.svg";
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
import { UserTypeContext } from "../../contexts/UserTypeContext";
import axios from "axios";
import { authAPI, orderAPI } from "../../constants/APIRoutes";
import FreelancerReg from "../FreelancerRegister/FreelancerReg";
import { RequestedContext } from "../../contexts/RequestedContext";
import { get, set } from "lodash";

gsap.registerPlugin(MorphSVGPlugin);

const Navbar = ({ search = false, alt = false, setSearchQuery = null }) => {
  const { isFreelancer, setIsFreelancer } = useContext(UserTypeContext);
  const { auth, setAuth } = useContext(AuthContext);
  const { notificationList } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showFreelancerRegister, setShowFreelancerRegister] = useState(false);
  const { checkRequestStatus } = useContext(RequestedContext);
  const [showOrderDropdown, setShowOrderDropdown] = useState(false);
  const [orderList, setOrderList] = useState([]);
  useEffect(() => {
    const list = Array.isArray(notificationList)
      ? notificationList
      : Object.values(notificationList || {});
    setUnreadCount(list.filter(n => n && !n.read).length)
  }, [notificationList]);

  const getRelativeDate = (isoDateStr) => {
    const now = new Date();
    const date = new Date(isoDateStr);
    const diffMs = now - date;
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffHours < 1) {
      const minutes = Math.floor(diffMs / (1000 * 60));
      return minutes <= 1 ? 'Just now' : `${minutes} minutes ago`;
    }
    if (diffHours < 24) {
      const hours = Math.floor(diffHours);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays > 1) return `${diffDays} days ago`;
    return 'Just now'; // fallback
  };


  const handleClickOutside = (event) => {
    const isNotificationClick = event.target.closest('.notification-dropdown') ||
      event.target.closest('[data-notification-trigger]');
    const isUserClick = event.target.closest('.user-dropdown') ||
      event.target.closest('[data-user-trigger]');
    const isOrderClick = event.target.closest('.order-dropdown') ||
      event.target.closest('[data-order-trigger]');

    if (!isNotificationClick && showNotificationDropdown) {
      setShowNotificationDropdown(false);
    }
    if (!isUserClick && showUserDropdown) {
      setShowUserDropdown(false);
    }
    if (!isOrderClick && showOrderDropdown) {
      setShowOrderDropdown(false);
    }
  };

  const getOrders = async () => {
    console.log("Fetching orders for freelancer:", auth?.data?.auth?.id);
    try {
      const response = await axios.get(`${orderAPI}/orders`, {
        withCredentials: true
      });
      const res = response.data;
      console.log("Orders fetched:", res);
      if (res.orderList) {
        setOrderList(res.orderList);
      };
    }
    catch (error) {
      console.error("Error fetching orders:", error);
    }
  }
  useEffect(() => {
    const load = async () => {
      await getOrders();
    }

    load();
  }, []);

  useEffect(() => {
    if (showOrderDropdown && isFreelancer) {
      getOrders();
    }
  }, [showOrderDropdown]);

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

  const formattedPrice = (price, locale = "id-ID", minFraction = 2, maxFraction = 2) => {
    return (price ?? 0).toLocaleString(locale, {
      minimumFractionDigits: minFraction,
      maximumFractionDigits: maxFraction,
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
                <div className="relative">
                  <motion.p
                    className="inline-block text-xl cursor-pointer transition-colors duration-300 font-bold"
                    whileHover={{ scale: 1.1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowOrderDropdown(!showOrderDropdown);
                    }}
                    data-order-trigger
                  >
                    Orders
                  </motion.p>
                  <AnimatePresence>
                    {showOrderDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-14 left-1/2 mt-2 w-201 transform -translate-x-1/2 bg-white rounded-tr-lg rounded-br-lg shadow-lg z-[99998] overflow-hidden order-dropdown"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#2E5077] to-[#4391b0]">
                          <h3 className="font-semibold text-white text-xl">Orders</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {orderList && orderList.length > 0 ?
                            (
                              <motion.div initial="hidden" animate="visible" className="text-black font-Archivo">
                                {orderList.map((order, index) => {
                                  return (
                                    <div
                                      key={index}
                                      className="h-32 flex items-center px-6 py-4 gap-6 border-t hover:bg-gray-50 cursor-pointer"
                                      onClick={() => navigate(`/manage-order/${order.orderId}`)}
                                    >
                                      <div className="flex items-center justify-center">
                                        <img
                                          className="w-20 h-20 object-cover rounded-full border"
                                          src={
                                            order.gig.images[0] === "temp"
                                              ? default_avatar
                                              : `${imageShow}${order.gig.images[0]}`
                                          }
                                          alt="profile"
                                          onLoad={() => setImageLoading(false)}
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = default_avatar;
                                          }}
                                        />
                                      </div>
                                      <div className="flex flex-col justify-center flex-1 h-full">
                                        <p className="font-semibold text-xl mb-2">{order.gig.name}</p>
                                        <div
                                          className={`text-sm p-2 border text-center w-28 rounded ${order.progress === 0
                                              ? "bg-gray-200 text-gray-700 border-gray-400"
                                              : order.progress === 1
                                                ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                                : order.progress === 2
                                                  ? "bg-blue-100 text-blue-800 border-blue-300"
                                                  : order.progress === 3
                                                    ? "bg-green-100 text-green-800 border-green-300"
                                                    : order.progress === 4
                                                      ? "bg-red-100 text-red-800 border-red-300"
                                                      : "bg-gray-100 text-gray-700 border-gray-300"
                                            }`}
                                        >
                                          {order.progress === 0
                                            ? "Waiting"
                                            : order.progress === 1
                                              ? "In Progress"
                                              : order.progress === 2
                                                ? "Delivered"
                                                : order.progress === 3
                                                  ? "Finished"
                                                  : order.progress === 4
                                                    ? "Rejected" : "Unknown"}
                                        </div>
                                      </div>
                                      <div className="flex flex-col justify-center items-end h-full text-right">
                                        <p className="text-gray-600 text-sm mb-2">{getRelativeDate(order.startTime)}</p>
                                        <p className="font-semibold text-lg">Rp. {formattedPrice(order.package.price) || 0}</p>
                                      </div>
                                    </div>
                                  )
                                })}
                              </motion.div>
                            )
                            :
                            (
                              <motion.div
                                className="p-8 text-center text-gray-500"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                No Orders yet
                              </motion.div>
                            )
                          }
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
          <div className="w-3/10 flex justify-end">
            <motion.div className="flex items-center gap-6 text-white">
              <div className="cursor-pointer w-12">
                <motion.img
                  src={message}
                  alt="Messages"
                  className="w-10 h-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/chat/def");
                  }}
                />
              </div>
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
                setShowFreelancerRegister={setShowFreelancerRegister}
              />

              <motion.div
                className="relative w-15 h-15 rounded-full flex items-center justify-center cursor-pointer mr-10"
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
                      className="absolute top-full right-0 w-50 bg-white rounded-lg shadow-lg z-[99999] mt-2"
                      onClick={(e) => e.stopPropagation()}
                      style={{ position: 'absolute', zIndex: 99999 }}
                    >
                      <div className="py-2 px-4 border-b border-gray-100 cursor-default bg-gradient-to-r from-[#2E5077] to-[#4391b0]">
                        <p className="text-white font-bold">{auth?.data?.auth?.name || "User"}</p>
                        <p className="text-white font-semibold text-xs">{auth?.data?.auth?.email}</p>
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
              <Link to="/privacy-policy" className="hover:text-blue-300 transition-colors duration-300">Privacy Policy</Link>
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
      <FreelancerReg
        isOpen={showFreelancerRegister}
        onClose={() => setShowFreelancerRegister(false)}
        onCloseAfterSave={() => {
          checkRequestStatus();
          setShowFreelancerRegister(false);
        }}
      />
    </>
  );
};

export default Navbar;