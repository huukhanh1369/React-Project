import api from '../apis/api';
import type { User, LoginCredentials, SignupCredentials } from '../../types/user.types';

export const authService = {
  // Kiểm tra email đã tồn tại
  checkEmailExists: async (email: string): Promise<User[]> => {
    try {
      const response = await api.get<User[]>(`/users?email=${email}`);
      return response.data;
    } catch (error) {
      console.error('Error checking email:', error);
      return [];
    }
  },

  // Đăng ký tài khoản
  signup: async (userData: Omit<SignupCredentials, 'confirmPassword'>): Promise<User> => {
    try {
      const newUser = {
        ...userData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      const response = await api.post<User>('/users', newUser);
      return response.data;
    } catch (error) {
      throw new Error('Lỗi đăng ký: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  },

  // Đăng nhập
  login: async (credentials: LoginCredentials): Promise<User | null> => {
    try {
      const response = await api.get<User[]>(`/users?email=${credentials.email}`);
      const users = response.data;

      if (users.length === 0) {
        return null;
      }

      const user = users[0];
      if (user.password === credentials.password) {
        return user;
      }
      return null;
    } catch (error) {
      throw new Error('Lỗi đăng nhập: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  },

  // Lấy thông tin user từ localStorage
  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Lưu user vào localStorage
  setCurrentUser: (user: User): void => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem('user');
  },
};