import type { Task, CreateTaskPayload, UpdateTaskPayload } from "../../types/task.types";

const API_URL = "http://localhost:3001";

export const taskService = {
  // Lấy tất cả tasks của một list
  getTasksByListId: async (listId: string): Promise<Task[]> => {
    try {
      console.log("Fetching tasks for listId:", listId);
      const response = await fetch(`${API_URL}/tasks?listId=${listId}`);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      console.log("Tasks fetched for list", listId, ":", data);
      return data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  // Lấy chi tiết một task
  getTaskById: async (taskId: string): Promise<Task> => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`);
      if (!response.ok) throw new Error("Failed to fetch task");
      return await response.json();
    } catch (error) {
      console.error("Error fetching task:", error);
      throw error;
    }
  },

  // Tạo task mới
  createTask: async (payload: CreateTaskPayload): Promise<Task> => {
    try {
      // Lấy số tasks hiện tại trong list để set position
      const tasksInList = await taskService.getTasksByListId(payload.listId);
      const position = String(tasksInList.length + 1);

      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: `task_${Date.now()}`,
          ...payload,
          description: "",
          position: position,
          completed: false,
          tags: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Failed to create task");
      return await response.json();
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  // Cập nhật task (bao gồm title, description, listId, position)
  updateTask: async (payload: UpdateTaskPayload): Promise<Task> => {
    try {
      const response = await fetch(`${API_URL}/tasks/${payload.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          updatedAt: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Failed to update task");
      return await response.json();
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  // Xóa task
  deleteTask: async (taskId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete task");
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },

  // Toggle completed status
  toggleTaskCompletion: async (
    taskId: string,
    completed: boolean
  ): Promise<Task> => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed,
          updatedAt: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Failed to toggle task completion");
      return await response.json();
    } catch (error) {
      console.error("Error toggling task completion:", error);
      throw error;
    }
  },
};