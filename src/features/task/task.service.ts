import api from "../../apis/api";
import type { Task, CreateTaskPayload, UpdateTaskPayload } from "../../types/task.types";

export const taskService = {
  // 🔹 Lấy tất cả tasks của một list
  getTasksByListId: async (listId: string): Promise<Task[]> => {
    try {
      console.log("📥 Fetching tasks for listId:", listId);
      const response = await api.get<Task[]>(`/tasks?listId=${listId}`);
      console.log("✅ Tasks fetched:", response.data.length, "tasks");
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  // 🔹 Lấy single task by ID
  getTaskById: async (taskId: string): Promise<Task> => {
    try {
      console.log("📥 Fetching task:", taskId);
      const response = await api.get<Task>(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching task:", error);
      throw error;
    }
  },

  // 🔹 Tạo task mới
  createTask: async (payload: CreateTaskPayload): Promise<Task> => {
    try {
      const newTask: Task = {
        id: `task_${Date.now()}`,
        ...payload,
        completed: false,
        position: String(Date.now()),
        startDate: null,
        dueDate: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      console.log("✅ Creating task:", newTask.title);
      const response = await api.post<Task>("/tasks", newTask);
      console.log("✅ Task created:", response.data.id);
      return response.data;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  // 🔹 Cập nhật task (bao gồm dates, description, etc)
  updateTask: async (id: string, payload: Partial<UpdateTaskPayload>): Promise<Task> => {
    try {
      const updateData = {
        ...payload,
        updatedAt: new Date().toISOString(),
      };
      console.log("✏️ Updating task:", id);
      console.log("   Data:", updateData);
      const response = await api.patch<Task>(`/tasks/${id}`, updateData);
      console.log("✅ Task updated:", response.data.id);
      return response.data;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  // 🔹 Update title
  updateTaskTitle: async (taskId: string, title: string): Promise<Task> => {
    try {
      console.log("✏️ Updating task title:", taskId, "→", title);
      const response = await api.patch<Task>(`/tasks/${taskId}`, {
        title: title.trim(),
        updatedAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error("Error updating task title:", error);
      throw error;
    }
  },

  // 🔹 Update description
  updateTaskDescription: async (taskId: string, description: string): Promise<Task> => {
    try {
      console.log("✏️ Updating task description:", taskId);
      const response = await api.patch<Task>(`/tasks/${taskId}`, {
        description: description.trim(),
        updatedAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error("Error updating task description:", error);
      throw error;
    }
  },

  // 🔹 Toggle task completion
  toggleTaskCompletion: async (taskId: string, completed: boolean): Promise<Task> => {
    try {
      console.log("🔄 Toggling task completion:", taskId, "→", completed);
      const response = await api.patch<Task>(`/tasks/${taskId}`, {
        completed: completed,
        updatedAt: new Date().toISOString(),
      });
      console.log("✅ Task completion toggled");
      return response.data;
    } catch (error) {
      console.error("Error toggling task completion:", error);
      throw error;
    }
  },

  // 🔹 Update task dates (start & due)
  updateTaskDates: async (
    taskId: string,
    startDate: string | null,
    dueDate: string | null
  ): Promise<Task> => {
    try {
      console.log("📅 Updating task dates:", taskId);
      console.log("   Start date:", startDate);
      console.log("   Due date:", dueDate);
      const response = await api.patch<Task>(`/tasks/${taskId}`, {
        startDate,
        dueDate,
        updatedAt: new Date().toISOString(),
      });
      console.log("✅ Task dates updated");
      return response.data;
    } catch (error) {
      console.error("Error updating task dates:", error);
      throw error;
    }
  },

  // 🔹 Update task position (drag & drop)
  updateTaskPosition: async (taskId: string, position: string): Promise<Task> => {
    try {
      console.log("🔀 Updating task position:", taskId, "→", position);
      const response = await api.patch<Task>(`/tasks/${taskId}`, {
        position,
        updatedAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error("Error updating task position:", error);
      throw error;
    }
  },

  // 🔹 Move task to different list
  moveTaskToList: async (taskId: string, newListId: string): Promise<Task> => {
    try {
      console.log("🔀 Moving task to list:", taskId, "→", newListId);
      const response = await api.patch<Task>(`/tasks/${taskId}`, {
        listId: newListId,
        updatedAt: new Date().toISOString(),
      });
      console.log("✅ Task moved to list");
      return response.data;
    } catch (error) {
      console.error("Error moving task:", error);
      throw error;
    }
  },

  // 🔹 Xóa task
  deleteTask: async (taskId: string): Promise<void> => {
    try {
      console.log("🗑️ Deleting task:", taskId);
      await api.delete(`/tasks/${taskId}`);
      console.log("✅ Task deleted");
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },

  // 🔹 Lấy tất cả tasks của một board
  getTasksByBoardId: async (boardId: string): Promise<Task[]> => {
    try {
      console.log("📥 Fetching all tasks for board:", boardId);
      // Lấy tất cả lists của board, sau đó lấy tasks của từng list
      const response = await api.get<Task[]>(`/tasks?boardId=${boardId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks by board:", error);
      throw error;
    }
  },

  // 🔹 Filter tasks by dates
  getTasksByDateRange: async (
    startDate: string,
    endDate: string
  ): Promise<Task[]> => {
    try {
      console.log("📅 Fetching tasks between:", startDate, "and", endDate);
      const response = await api.get<Task[]>(
        `/tasks?startDate_gte=${startDate}&dueDate_lte=${endDate}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks by date range:", error);
      throw error;
    }
  },

  // 🔹 Filter tasks by completed status
  getTasksByCompletionStatus: async (completed: boolean): Promise<Task[]> => {
    try {
      console.log("🔍 Fetching tasks with completion status:", completed);
      const response = await api.get<Task[]>(`/tasks?completed=${completed}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks by completion status:", error);
      throw error;
    }
  },
};