import { useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const AuthRouting = ({ component: Component }) => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      navigate("/catalog");
    } 
    else {
      navigate("/sign-in");
    }
  }, [auth]);

  return <Component />;
};

export default AuthRouting;
