import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  if (auth) {
    return <Navigate to="/sign-in" />;
  }

  return children;
};

export default ProtectedRoute;
