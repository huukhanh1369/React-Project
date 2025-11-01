import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apis/api";
import type { Task, CreateTaskPayload, UpdateTaskPayload } from "../../types/task.types";

interface TaskState {
  items: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchTasksByListId = createAsyncThunk(
  "tasks/fetchByListId",
  async (listId: string) => {
    try {
      const response = await api.get<Task[]>(`/tasks?listId=${listId}`);
      console.log("📥 Tasks fetched for list:", listId, response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/create",
  async (payload: CreateTaskPayload) => {
    try {
      const newTask: Task = {
        id: `task_${Date.now()}`,
        ...payload,
        completed: false,
        position: String(Date.now()),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const response = await api.post<Task>("/tasks", newTask);
      console.log("✅ Task created:", response.data.id);
      return response.data;
    } catch (error: any) {
      console.error("Error creating task:", error);
      throw error;
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async (payload: UpdateTaskPayload) => {
    try {
      const updateData = {
        ...payload,
        updatedAt: new Date().toISOString(),
      };

      console.log("✏️ Updating task:", payload.id, updateData);
      const response = await api.patch<Task>(`/tasks/${payload.id}`, updateData);
      console.log("✅ Task updated:", response.data.id);
      return response.data;
    } catch (error: any) {
      console.error("Error updating task:", error);
      throw error;
    }
  }
);

export const toggleTaskCompletion = createAsyncThunk(
  "tasks/toggleCompletion",
  async (payload: { taskId: string; completed: boolean }) => {
    try {
      const response = await api.patch<Task>(`/tasks/${payload.taskId}`, {
        completed: payload.completed,
        updatedAt: new Date().toISOString(),
      });
      console.log("✅ Task completion toggled:", response.data.id);
      return response.data;
    } catch (error: any) {
      console.error("Error toggling task:", error);
      throw error;
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (taskId: string) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      console.log("🗑️ Task deleted:", taskId);
      return taskId;
    } catch (error: any) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchTasksByListId
      .addCase(fetchTasksByListId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksByListId.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasksByListId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tasks";
      })

      // createTask
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.error.message || "Failed to create task";
      })

      // updateTask
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update task";
      })

      // toggleTaskCompletion
      .addCase(toggleTaskCompletion.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(toggleTaskCompletion.rejected, (state, action) => {
        state.error = action.error.message || "Failed to toggle task";
      })

      // deleteTask
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete task";
      });
  },
});

export default taskSlice.reducer;