import { useRef, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const MorphToggleButton = ({ isFreelancer, setIsFreelancer, setShowFreelancerRegister }) => {
  const { auth } = useContext(AuthContext);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedRole = localStorage.getItem("isFreelancer");
    if (auth?.data?.auth?.access === true) {
      setIsFreelancer(storedRole === "true");
    }
  }, [setIsFreelancer]);

  const handleClick = () => {
    if(auth?.data?.auth?.access === false && isFreelancer == false){
      setShowFreelancerRegister(true);
      return;
    }
    const newState = !isFreelancer;
    localStorage.setItem("isFreelancer", newState);
    if (location.pathname.startsWith("/chat") ||
      location.pathname.startsWith("/profile")) {
      setIsFreelancer(newState);
      return;
    }
    if (newState) {
      navigate(`/freelancer-profile/${auth?.data?.auth?.id}`);
    } else {
      navigate("/home");
    }
    setIsFreelancer(newState);
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div
        ref={containerRef}
        onClick={handleClick}
        className={`relative cursor-pointer px-3 py-3 flex items-center ${isFreelancer}`}
        style={{
          minWidth: "170px",
        }}
      >
        {/* Icon on the left */}
        <div className="mr-2">
          {isFreelancer ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white transition-opacity duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white transition-opacity duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          )}
        </div>

        {/* Labels with sliding animation */}
        <div className="flex-grow relative h-6 overflow-hidden">
          <div
            className={`absolute w-full transition-transform duration-300 ease-in-out ${isFreelancer ? "translate-y-0" : "-translate-y-full"
              }`}
          >
            <span className="text-white font-medium">FREELANCER</span>
          </div>
          <div
            className={`absolute w-full transition-transform duration-300 ease-in-out ${isFreelancer ? "translate-y-full" : "translate-y-0"
              }`}
          >
            <span className="text-white font-medium">USER</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MorphToggleButton;