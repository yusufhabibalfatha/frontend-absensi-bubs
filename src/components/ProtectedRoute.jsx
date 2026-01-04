// components/ProtectedRoute.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!user || !isLoggedIn) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(user);

    // Check role if specified
    if (role && userData.role !== role) {
      navigate("/login");
      return;
    }
  }, [navigate, role]);

  return children;
};

export default ProtectedRoute;
