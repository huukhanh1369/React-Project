import api from "../apis/api";
import type {
  User,
  LoginCredentials,
  SignupCredentials,
} from "../../types/user.types";
import { SignJWT, decodeJwt } from "jose";

const SECRET_KEY = new TextEncoder().encode("my_super_secret_key");

export const authService = {
  // ✅ Kiểm tra email tồn tại
  checkEmailExists: async (email: string): Promise<User[]> => {
    try {
      const res = await api.get<User[]>(`/users?email=${email}`);
      return res.data;
    } catch (error) {
      console.error("Error checking email:", error);
      return [];
    }
  },

  // ✅ Tạo token JWT
  generateToken: async (user: User): Promise<string> => {
    return await new SignJWT({ id: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(SECRET_KEY);
  },

  // ✅ Đăng ký tài khoản mới
  signup: async (
    userData: Omit<SignupCredentials, "confirmPassword">
  ): Promise<{ user: User; token: string }> => {
    try {
      const newUser: User = {
        ...userData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };

      const response = await api.post<User>("/users", newUser);

      // 🔹 Sinh token sau khi tạo user
      const token = await authService.generateToken(response.data);

      return { user: response.data, token };
    } catch (error) {
      throw new Error(
        "Lỗi đăng ký: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  },

  // ✅ Đăng nhập
  login: async (
    credentials: LoginCredentials
  ): Promise<{ user: User; token: string } | null> => {
    try {
      const response = await api.get<User[]>(
        `/users?email=${credentials.email}`
      );
      const users = response.data;

      if (users.length === 0) return null;

      const user = users[0];
      if (user.password !== credentials.password) return null;

      // 🔹 Tạo token JWT sau khi xác thực
      const token = await authService.generateToken(user);

      return { user, token };
    } catch (error) {
      throw new Error(
        "Lỗi đăng nhập: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  },

  // ✅ Lưu user + token vào localStorage
  setAuthData: (user: User, token: string): void => {
    const authData = { user, token };
    localStorage.setItem("authData", JSON.stringify(authData));
  },

  // ✅ Lấy user hiện tại (và kiểm tra hạn token)
  // getCurrentUser: (): User | null => {
  //   const data = localStorage.getItem("authData");
  //   if (!data) return null;

  //   const { user, token } = JSON.parse(data);
  //   try {
  //     const decoded = decodeJwt(token);
  //     const now = Math.floor(Date.now() / 1000);
  //     if (decoded.exp && decoded.exp < now) {
  //       console.warn("⚠️ Token expired, removing auth data");
  //       localStorage.removeItem("authData");
  //       return null;
  //     }
  //     return user;
  //   } catch {
  //     localStorage.removeItem("authData");
  //     return null;
  //   }
  // },

  getCurrentUser: (): { user: User; token: string } | null => {
    const data = localStorage.getItem("authData");
    if (!data) return null;
    return JSON.parse(data);
  },

  updateUser: async (userId: number, data: Partial<User>): Promise<User> => {
    const res = await api.patch<User>(`/users/${userId}`, data);
    return res.data;
  },

  // ✅ Đăng xuất
  logout: (): void => {
    localStorage.removeItem("authData");
  },
};
