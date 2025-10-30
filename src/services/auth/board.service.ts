// src/services/board/board.service.ts
import api from "../apis/api";
import type { Board } from "../../types/board.types";

export const boardService = {
  // 🔹 Fetch all boards of a user
  getBoards: async (userId: number): Promise<Board[]> => {
    try {
      const res = await api.get<Board[]>(`/boards?userId=${userId}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching boards:", error);
      throw error;
    }
  },

  // 🔹 Create new board
  createBoard: async (board: Omit<Board, "id">): Promise<Board> => {
    try {
      const newBoard: Board = {
        ...board,
        id: String(Date.now()),
      };
      const res = await api.post<Board>("/boards", newBoard);
      return res.data;
    } catch (error) {
      console.error("Error creating board:", error);
      throw error;
    }
  },

  // 🔹 Update board - send null to remove unused field
  updateBoard: async (id: string, data: Partial<Board>): Promise<Board> => {
    try {
      const updateData: any = { ...data };

      // Only keep one: background OR color
      if (data.background) {
        updateData.color = null; // Send null to delete color field
      } else if (data.color) {
        updateData.background = null; // Send null to delete background field
      }

      const res = await api.patch<Board>(`/boards/${id}`, updateData);
      return res.data;
    } catch (error) {
      console.error("Error updating board:", error);
      throw error;
    }
  },

  // 🔹 Delete board
  deleteBoard: async (id: string): Promise<void> => {
    try {
      await api.delete(`/boards/${id}`);
    } catch (error) {
      console.error("Error deleting board:", error);
      throw error;
    }
  },
};