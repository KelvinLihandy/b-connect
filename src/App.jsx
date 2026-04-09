import React, { Suspense, lazy, useContext, useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import AuthRouting from "./components/auth_routing/AuthRouting";
import { AuthContext } from "./contexts/AuthContext";
import { NotificationContext } from "./contexts/NotificationContext";
import { UserTypeContext } from "./contexts/UserTypeContext";
import { DisabledGigsContext } from "./contexts/DisabledGigsContext";
import { connectSocket, disconnectSocket, socket } from "./socket";

const SignUp = lazy(() => import("./views/sign_up/SignUp"));
const SignIn = lazy(() => import("./views/sign_in/SignIn"));
const Home = lazy(() => import("./views/home/Home"));
const Detail = lazy(() => import("./views/detail/Detail"));
const AboutUs = lazy(() => import("./views/about_us/AboutUs"));
const ForgotPassword = lazy(() => import("./views/forgot_password/ForgotPassword"));
const InputOTP = lazy(() => import("./views/input_otp/InputOTP"));
const ChangePassword = lazy(() => import("./views/change_password/ChangePassword"));
const CatalogPage = lazy(() => import("./views/catalogPage/CatalogPage"));
const Chat = lazy(() => import("./views/chat/Chat"));
const FreelancerProfile = lazy(() => import("./views/FreelancerProfile/FreelancerProfile"));
const Profile = lazy(() => import("./views/profile/Profile"));
const UserProfile = lazy(() => import("./views/User_profile/UserProfile"));
const ManageOrder = lazy(() => import("./views/manage_order/ManageOrder"));
const Invoice = lazy(() => import("./views/invoice/Invoice"));
const PrivacyPolicy = lazy(() => import("./views/privacy_policy/PrivacyPolicy"));

const App = () => {
  const { auth, getAuth } = useContext(AuthContext);
  const { isFreelancer } = useContext(UserTypeContext);
  const [ready, setReady] = useState(false);
  const { notificationList, setNotificationList } = useContext(NotificationContext);
  const { getDisabledGigs } = useContext(DisabledGigsContext);
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
  }, [setNotificationList]);

  useEffect(() => {
    if (auth?.data?.auth?.id) {
      connectSocket();
      return;
    }

    disconnectSocket();
  }, [auth?.data?.auth?.id]);

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
  }, []);

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
      <Suspense
        fallback={(
          <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-slate-600 font-Archivo">Loading…</div>
          </div>
        )}
      >
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
      </Suspense>
    </>
  );
};

export default App;
