import type { Tag, CreateTagPayload, UpdateTagPayload } from "../../types/tag.types";

const API_URL = "http://localhost:3000";

export const tagService = {
  // Lấy tất cả tags của một task
  getTagsByTaskId: async (taskId: string): Promise<Tag[]> => {
    try {
      const response = await fetch(`${API_URL}/tags?taskId=${taskId}`);
      if (!response.ok) throw new Error("Failed to fetch tags");
      return await response.json();
    } catch (error) {
      console.error("Error fetching tags:", error);
      throw error;
    }
  },

  // Tạo tag mới
  createTag: async (payload: CreateTagPayload): Promise<Tag> => {
    try {
      const response = await fetch(`${API_URL}/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: `tag_${Date.now()}`,
          ...payload,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Failed to create tag");
      return await response.json();
    } catch (error) {
      console.error("Error creating tag:", error);
      throw error;
    }
  },

  // Cập nhật tag
  updateTag: async (payload: UpdateTagPayload): Promise<Tag> => {
    try {
      const response = await fetch(`${API_URL}/tags/${payload.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          updatedAt: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Failed to update tag");
      return await response.json();
    } catch (error) {
      console.error("Error updating tag:", error);
      throw error;
    }
  },

  // Xóa tag
  deleteTag: async (tagId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/tags/${tagId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete tag");
    } catch (error) {
      console.error("Error deleting tag:", error);
      throw error;
    }
  },
};