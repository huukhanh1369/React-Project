import type { TaskList, CreateListPayload, UpdateListPayload } from "../../types/list.types";

const API_URL = "http://localhost:3000";

export const listService = {
  // Lấy tất cả lists của một board
  getListsByBoardId: async (boardId: string): Promise<TaskList[]> => {
    try {
      const response = await fetch(`${API_URL}/lists?boardId=${boardId}`);
      if (!response.ok) throw new Error("Failed to fetch lists");
      return await response.json();
    } catch (error) {
      console.error("Error fetching lists:", error);
      throw error;
    }
  },

  // Lấy chi tiết một list
  getListById: async (listId: string): Promise<TaskList> => {
    try {
      const response = await fetch(`${API_URL}/lists/${listId}`);
      if (!response.ok) throw new Error("Failed to fetch list");
      return await response.json();
    } catch (error) {
      console.error("Error fetching list:", error);
      throw error;
    }
  },

  // Tạo list mới
  createList: async (payload: CreateListPayload): Promise<TaskList> => {
    try {
      // Lấy số lượng lists hiện tại để set order
      const lists = await listService.getListsByBoardId(payload.boardId);
      const order = lists.length + 1;

      const response = await fetch(`${API_URL}/lists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: `list_${Date.now()}`,
          ...payload,
          tasks: [],
          order,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Failed to create list");
      return await response.json();
    } catch (error) {
      console.error("Error creating list:", error);
      throw error;
    }
  },

  // Cập nhật list
  updateList: async (payload: UpdateListPayload): Promise<TaskList> => {
    try {
      const response = await fetch(`${API_URL}/lists/${payload.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          updatedAt: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Failed to update list");
      return await response.json();
    } catch (error) {
      console.error("Error updating list:", error);
      throw error;
    }
  },

  // Xóa list
  deleteList: async (listId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/lists/${listId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete list");
    } catch (error) {
      console.error("Error deleting list:", error);
      throw error;
    }
  },
};