import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "../features/auth/components/SignUp";
import SignIn from "../features/auth/components/SignIn";
import Dashboard from "../features/board/pages/Dashboard";
import BoardView from "../features/board/pages/BoardView";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang đăng ký */}
        <Route path="/signup" element={<Signup />} />

        {/* Trang đăng nhập */}
        <Route path="/" element={<SignIn />} />

        {/* Dashboard (cần đăng nhập) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Trang chi tiết từng board */}
        <Route
          path="/board/:boardId"
          element={
            <ProtectedRoute>
              <BoardView />
            </ProtectedRoute>
          }
        />

        {/* Nếu route không tồn tại → quay lại đăng nhập */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
