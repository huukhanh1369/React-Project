import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/Login/SignUp";
import SignIn from "./components/Login/SignIn";
import Dashboard from "./services/auth/Dashboard";
import BoardView from "./services/auth/BoardView"; 
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
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
          path="/board/:id"
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

export default App;
