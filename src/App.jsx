import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import io from "socket.io-client";
import "./App.css";
import SignUp from "./views/sign_up/SignUp";
import SignIn from "./views/sign_in/SignIn";
import Home from "./views/home/Home";
import Detail from "./views/detail/Detail";
import AboutUs from "./views/about_us/AboutUs";
import ForgotPassword from "./views/forgot_password/ForgotPassword";
import InputOTP from "./views/input_otp/InputOTP";
import ChangePassword from "./views/change_password/ChangePassword";
import CatalogPage from "./views/catalogPage/CatalogPage";
import Chat from "./views/chat/Chat";
import FreelancerProfile from "./views/FreelancerProfile/FreelancerProfile";
import AuthRouting from "./components/auth_routing/AuthRouting";
import { AuthContext } from "./contexts/AuthContext";
import Profile from "./views/profile/Profile";
import { NotificationContext } from "./contexts/NotificationContext";
import { UserTypeContext } from "./contexts/UserTypeContext";
import UserProfile from "./views/User_profile/UserProfile";
import ManageOrder from "./views/manage_order/ManageOrder";
import Invoice from "./views/invoice/Invoice";
import { DisabledGigsContext } from "./contexts/DisabledGigsContext";
import PrivacyPolicy from "./views/privacy_policy/PrivacyPolicy";

// export const socket = io("https://b-connect-socket.webpubsub.azure.com", {
//   path: "/clients/socketio/hubs/Hub",
//   transports: ["polling"],
// });

export const socket = io("http://localhost:5000");

const App = () => {
  const { auth, getAuth } = useContext(AuthContext);
  const { isFreelancer } = useContext(UserTypeContext);
  const [ready, setReady] = useState(false);
  const { notificationList, setNotificationList } = useContext(NotificationContext);
  const { getDisabledGigs } = useContext(DisabledGigsContext);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const handleReceiveNotifications = (notificationsData) => {
      console.log("notifs data", notificationsData);
      setNotificationList(notificationsData);
    };
    socket.on("receive_notifications", handleReceiveNotifications);

    return () => {
      socket.off("receive_notifications", handleReceiveNotifications);
    };
  }, []);

  useEffect(() => {
    if (auth?.data?.auth?.id) {
      socket.emit("retrieve_notifications", auth?.data?.auth?.id);
    }
  }, [auth?.data?.auth?.id, location.pathname]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    const initAuth = async () => {
      await getAuth();
      setReady(true);
    };

    initAuth();
  }, [auth?.data?.auth?.id]);

  useEffect(() => {
    const checkDisabled = async () => {
      if (!ready) return;
      await getDisabledGigs();
    }

    checkDisabled();
  }, [ready, auth?.data?.auth?.id])

  if (!ready) {
    return <></>;
  }

  return (
    <>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/sign-in/forget" element={<ForgotPassword />} />
        <Route path="/sign-in/verify-otp" element={<InputOTP />} />
        <Route path="/sign-in/change-password" element={<ChangePassword />} />
        <Route path="/manage-order/:orderId" element={<ManageOrder />} />
        <Route path="/invoice/:orderId" element={<Invoice />} />

        {isFreelancer ? (
          <>
            <Route
              path="/"
              element={<Navigate to={`/freelancer-profile/${auth?.data?.auth?.id}`} replace />}
            />
            <Route
              path="/home"
              element={<Navigate to={`/freelancer-profile/${auth?.data?.auth?.id}`} replace />}
            />
            <Route
              path="/catalog"
              element={<Navigate to={`/freelancer-profile/${auth?.data?.auth?.id}`} replace />}
            />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/catalog" element={<CatalogPage />} />
          </>
        )}
        <Route path="/detail/:gigId" element={<Detail />} />
        <Route path="/freelancer-profile/:id" element={<FreelancerProfile />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        {/* Protected routes - require authentication */}
        <Route path="/chat" element={<Navigate to="/chat/def" replace />} />
        <Route path="/chat/:roomId" element={<AuthRouting component={Chat} />} />
        <Route path="/profile" element={<AuthRouting component={Profile} />} />
        <Route path="/user-profile/:id" element={<AuthRouting component={UserProfile} />} />

      </Routes>
    </>
  );
};

export default App;
