// src/services/board/board.service.ts
import api from "../apis/api";
import type { Board } from "../../types/board.types";

export const boardService = {
  // 🔹 Lấy toàn bộ board của 1 user
  getBoards: async (userId: number): Promise<Board[]> => {
    const res = await api.get<Board[]>(`/boards?userId=${userId}`);
    return res.data;
  },

  // 🔹 Thêm mới board
  createBoard: async (board: Omit<Board, "id">): Promise<Board> => {
    const newBoard = { ...board, id:String(Date.now()) };
    const res = await api.post<Board>("/boards", newBoard); // ✅ POST đúng
    return res.data;
  },

  // 🔹 Cập nhật board
  updateBoard: async (id: number, data: Partial<Board>): Promise<Board> => {
    const res = await api.patch<Board>(`/boards/${id}`, data);
    return res.data;
  },

  // 🔹 Xoá board
  deleteBoard: async (id: number): Promise<void> => {
    await api.delete(`/boards/${id}`);
  },
};
