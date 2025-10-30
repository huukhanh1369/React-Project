import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Task, CreateTaskPayload, UpdateTaskPayload, TasksState } from "../../types/task.types";
import { taskService } from "../../services/auth/task.service";

const initialState: TasksState = {
  items: [],
  loading: false,
  error: null,
  selectedTask: null,
};

// Async thunks
export const fetchTasksByListId = createAsyncThunk(
  "tasks/fetchByListId",
  async (listId: string) => {
    return await taskService.getTasksByListId(listId);
  }
);

export const fetchTaskById = createAsyncThunk(
  "tasks/fetchById",
  async (taskId: string) => {
    return await taskService.getTaskById(taskId);
  }
);

export const createTask = createAsyncThunk(
  "tasks/create",
  async (payload: CreateTaskPayload) => {
    return await taskService.createTask(payload);
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async (payload: UpdateTaskPayload) => {
    return await taskService.updateTask(payload);
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (taskId: string) => {
    await taskService.deleteTask(taskId);
    return taskId;
  }
);

export const toggleTaskCompletion = createAsyncThunk(
  "tasks/toggleCompletion",
  async (payload: { taskId: string; completed: boolean }) => {
    return await taskService.toggleTaskCompletion(payload.taskId, payload.completed);
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTasks: (state) => {
      state.items = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
  },
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

      // fetchTaskById
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.selectedTask = action.payload;
      })

      // createTask
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create task";
      })

      // updateTask
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedTask?.id === action.payload.id) {
          state.selectedTask = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update task";
      })

      // deleteTask
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task.id !== action.payload);
        if (state.selectedTask?.id === action.payload) {
          state.selectedTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete task";
      })

      // toggleTaskCompletion
      .addCase(toggleTaskCompletion.fulfilled, (state, action) => {
        const index = state.items.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedTask?.id === action.payload.id) {
          state.selectedTask = action.payload;
        }
      });
  },
});

export const { clearTasks, clearError, setSelectedTask } = taskSlice.actions;
export default taskSlice.reducer;