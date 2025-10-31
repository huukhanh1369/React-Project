import { createSlice,  } from "@reduxjs/toolkit";
import type { PayloadAction,  } from "@reduxjs/toolkit";
import type { User } from "../../types/user.types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("authData");
    },
    updateUser: (state, action: PayloadAction<User>) => {
      if (state.user) state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { setAuthData, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
