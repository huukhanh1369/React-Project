import api from "../../apis/api";
import type { Tag, CreateTagPayload, UpdateTagPayload } from "../../types/tag.types";

export const tagService = {
  // Lấy tất cả tags của một task
  getTagsByTaskId: async (taskId: string): Promise<Tag[]> => {
    try {
      console.log("📥 Fetching tags for taskId:", taskId);
      const response = await api.get<Tag[]>(`/tags?taskId=${taskId}`);
      console.log("✅ Tags fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching tags:", error);
      throw error;
    }
  },

  // Tạo tag mới
  createTag: async (payload: CreateTagPayload): Promise<Tag> => {
    try {
      const newTag: Tag = {
        id: `tag_${Date.now()}`,
        ...payload,
      };
      console.log("🟢 Creating tag:", newTag);
      const response = await api.post<Tag>("/tags", newTag);
      console.log("✅ Tag created:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating tag:", error);
      throw error;
    }
  },

  // Cập nhật tag
  updateTag: async (payload: UpdateTagPayload): Promise<Tag> => {
    try {
      console.log("✏️ Updating tag:", payload.id);
      const response = await api.patch<Tag>(`/tags/${payload.id}`, payload);
      console.log("✅ Tag updated:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating tag:", error);
      throw error;
    }
  },

  // Xóa tag
  deleteTag: async (tagId: string): Promise<void> => {
    try {
      console.log("🗑️ Deleting tag:", tagId);
      await api.delete(`/tags/${tagId}`);
      console.log("✅ Tag deleted");
    } catch (error) {
      console.error("Error deleting tag:", error);
      throw error;
    }
  },
};