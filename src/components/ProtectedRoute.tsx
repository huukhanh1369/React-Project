import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authService } from "../services/auth/auth.service";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const currentUser = authService.getCurrentUser();

  // Nếu không có user hoặc token hết hạn → chuyển hướng sang trang login
  if (!currentUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
