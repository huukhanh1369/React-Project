import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/apis/api";

// =========================
// 📋 Interface
// =========================
export interface Board {
  id: string;
  title: string;
  background?: string;
  color?: string;
  createdAt: string;
  userId: number;
  closed?: boolean;
  started?: boolean;
}

// =========================
// 📋 State
// =========================
interface BoardState {
  boards: Board[];
  loading: boolean;
  error: string | null;
}

const initialState: BoardState = {
  boards: [],
  loading: false,
  error: null,
};

// =========================
// 📋 Thunks
// =========================

// ✅ Fetch all boards by userId
export const fetchBoards = createAsyncThunk(
  "boards/fetchBoards",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await api.get<Board[]>(`/boards?userId=${userId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch boards");
    }
  }
);

// ✅ Add new board
export const addBoard = createAsyncThunk(
  "boards/addBoard",
  async (board: Omit<Board, "id" | "createdAt">, { rejectWithValue }) => {
    try {
      const newBoard: Board = {
        ...board,
        id: String(Date.now()),
        createdAt: new Date().toISOString(),
      };
      const response = await api.post<Board>("/boards", newBoard);
      return response.data;p
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add board");
    }
  }
);

// ✅ Update board (send null to delete unused field: background OR color)
export const updateBoard = createAsyncThunk(
  "boards/updateBoard",
  async (board: Board, { rejectWithValue }) => {
    try {
      const updateData: any = { ...board };

      // Only keep one: background OR color
      if (board.background) {
        updateData.color = null; // Send null to delete color field
      } else if (board.color) {
        updateData.background = null; // Send null to delete background field
      }

      const response = await api.patch<Board>(`/boards/${board.id}`, updateData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update board");
    }
  }
);

// ✅ Delete board
export const deleteBoard = createAsyncThunk(
  "boards/deleteBoard",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/boards/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete board");
    }
  }
);

// =========================
// 📋 Slice
// =========================
const boardSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- FETCH ---
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.boards = action.payload;
        state.loading = false;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch boards";
      })

      // --- ADD ---
      .addCase(addBoard.fulfilled, (state, action) => {
        state.boards.push(action.payload);
      })
      .addCase(addBoard.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to add board";
      })

      // --- UPDATE ---
      .addCase(updateBoard.fulfilled, (state, action) => {
        const index = state.boards.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.boards[index] = action.payload;
        }
      })
      .addCase(updateBoard.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to update board";
      })

      // --- DELETE ---
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.boards = state.boards.filter((b) => b.id !== action.payload);
      })
      .addCase(deleteBoard.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to delete board";
      });
  },
});

export default boardSlice.reducer;