import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authService } from "./features/auth/auth.service";
import { setAuthData } from "./features/auth/authSlice";
import AppRouter from "./routes/AppRouter";

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const authData = authService.getCurrentUser();
    if (authData) {
      dispatch(setAuthData({ user: authData.user, token: authData.token }));
    }
  }, [dispatch]);

  return <AppRouter />;
};

export default App;
