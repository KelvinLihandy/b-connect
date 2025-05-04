import { useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const HomeRouting = ({ component: Component }) => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) navigate("/home");
    else navigate("/catalog");
  }, [auth]);

  return <Component />
};

export default HomeRouting;