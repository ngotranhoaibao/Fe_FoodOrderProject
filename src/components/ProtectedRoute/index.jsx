
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "@/contexts/authContext"; 


const ProtectedRoute = ({ children, role }) => {
  const { userInfo } = useContext(AuthContext);
  const location = useLocation();

  const isAuthenticated = userInfo?.isAuthenticated;
  const currentRole = userInfo?.user?.role ?? null;

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  } 

  if (role) {
    const allowedRoles = Array.isArray(role) ? role : String(role).split(/\s+/); // Kiểm tra xem role hiện tại của user có nằm trong danh sách được phép không
    if (!allowedRoles.includes(currentRole)) {
      return <Navigate to="/" replace />;
    }
  } 

  return children;
};

export default ProtectedRoute;
