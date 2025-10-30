import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Signup from "./components/Login/SignUp";
import SignIn from "./components/Login/SignIn";
import Dashboard from "./services/auth/board/Dashboard";
import BoardView from "./services/auth/board/BoardView"; 
import ProtectedRoute from "./components/ProtectedRoute";
import { authService } from "./services/auth/auth.service";
import { setAuthData } from "./stores/slices/authSlice"; 
const App: React.FC = () => {
   const dispatch = useDispatch();

  useEffect(() => {
    const authData = authService.getCurrentUser();
    if (authData) {
      dispatch(setAuthData({ user: authData.user, token: authData.token }));
    }
  }, [dispatch]);
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
