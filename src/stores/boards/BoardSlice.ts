import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/apis/api";

// =========================
// 🔹 Interface
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
// 🔹 State
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
// 🔹 Thunks
// =========================

// ✅ Lấy toàn bộ boards theo userId
export const fetchBoards = createAsyncThunk(
  "boards/fetchBoards",
  async (userId: number) => {
    const response = await api.get<Board[]>(`/boards?userId=${userId}`);
    return response.data;
  }
);

// ✅ Thêm board mới
export const addBoard = createAsyncThunk(
  "boards/addBoard",
  async (board: Omit<Board, "id" | "createdAt">) => {
    const newBoard: Board = {
      ...board,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    };
    const response = await api.post<Board>("/boards", newBoard);
    return response.data;
  }
);

// ✅ Cập nhật board (xoá key thừa nếu chuyển giữa color ↔ background)
export const updateBoard = createAsyncThunk(
  "boards/updateBoard",
  async (board: Board) => {
    // Nếu có background thì xoá color, ngược lại xoá background
    const cleanBoard: Partial<Board> = {
      ...board,
      ...(board.background
        ? { color: undefined }
        : { background: undefined }),
    };

    const response = await api.patch<Board>(`/boards/${board.id}`, cleanBoard);
    return response.data;
  }
);

// ✅ Xoá board
export const deleteBoard = createAsyncThunk(
  "boards/deleteBoard",
  async (id: string) => {
    await api.delete(`/boards/${id}`);
    return id;
  }
);

// =========================
// 🔹 Slice
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
        state.error = action.error.message || "Failed to fetch boards";
      })

      // --- ADD ---
      .addCase(addBoard.fulfilled, (state, action) => {
        state.boards.push(action.payload);
      })

      // --- UPDATE ---
      .addCase(updateBoard.fulfilled, (state, action) => {
        const index = state.boards.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.boards[index] = action.payload;
        }
      })

      // --- DELETE ---
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.boards = state.boards.filter((b) => b.id !== action.payload);
      });
  },
});

export default boardSlice.reducer;
