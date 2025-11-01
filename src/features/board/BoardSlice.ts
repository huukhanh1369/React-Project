import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../apis/api";

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
  starred?: boolean;
}

// =========================
// 📋 State
// =========================
interface BoardState {
  boards: Board[];
  starredBoards: Board[];
  closedBoards: Board[];
  loading: boolean;
  error: string | null;
  filterType: "all" | "starred" | "closed";
  currentBoardId?: string;
}

const initialState: BoardState = {
  boards: [],
  starredBoards: [],
  closedBoards: [],
  loading: false,
  error: null,
  filterType: "all",
};

// =========================
// 📋 Thunks
// =========================

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

export const addBoard = createAsyncThunk(
  "boards/addBoard",
  async (board: Omit<Board, "id" | "createdAt">, { rejectWithValue }) => {
    try {
      const newBoard: Board = {
        ...board,
        id: String(Date.now()),
        createdAt: new Date().toISOString(),
        starred: false,
        closed: false,
      };
      const response = await api.post<Board>("/boards", newBoard);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add board");
    }
  }
);

export const updateBoard = createAsyncThunk(
  "boards/updateBoard",
  async (board: Board, { rejectWithValue }) => {
    try {
      const updateData: any = { ...board };

      if (board.background) {
        updateData.color = null;
      } else if (board.color) {
        updateData.background = null;
      }

      const response = await api.patch<Board>(`/boards/${board.id}`, updateData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update board");
    }
  }
);

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
  reducers: {
    setFilterType: (state, action) => {
      state.filterType = action.payload;
    },
    setCurrentBoardId: (state, action) => {
      state.currentBoardId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- FETCH ---
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.boards = action.payload.filter((b) => !b.closed);
        state.starredBoards = action.payload.filter((b) => b.starred && !b.closed);
        state.closedBoards = action.payload.filter((b) => b.closed);
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
        const starredIndex = state.starredBoards.findIndex((b) => b.id === action.payload.id);
        const closedIndex = state.closedBoards.findIndex((b) => b.id === action.payload.id);

        // Handle closed status
        if (action.payload.closed) {
          // Remove from boards and starredBoards, add to closedBoards
          if (index !== -1) state.boards.splice(index, 1);
          if (starredIndex !== -1) state.starredBoards.splice(starredIndex, 1);
          if (!state.closedBoards.find((b) => b.id === action.payload.id)) {
            state.closedBoards.push(action.payload);
          }
        } else {
          // Remove from closedBoards, add back to boards
          if (closedIndex !== -1) state.closedBoards.splice(closedIndex, 1);
          if (index === -1) {
            state.boards.push(action.payload);
          } else {
            state.boards[index] = action.payload;
          }
        }

        // Handle starred status
        if (action.payload.starred && !action.payload.closed) {
          if (!state.starredBoards.find((b) => b.id === action.payload.id)) {
            state.starredBoards.push(action.payload);
          } else {
            const idx = state.starredBoards.findIndex((b) => b.id === action.payload.id);
            if (idx !== -1) state.starredBoards[idx] = action.payload;
          }
        } else {
          state.starredBoards = state.starredBoards.filter((b) => b.id !== action.payload.id);
        }
      })
      .addCase(updateBoard.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to update board";
      })

      // --- DELETE ---
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.boards = state.boards.filter((b) => b.id !== action.payload);
        state.starredBoards = state.starredBoards.filter((b) => b.id !== action.payload);
        state.closedBoards = state.closedBoards.filter((b) => b.id !== action.payload);
      })
      .addCase(deleteBoard.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to delete board";
      });
  },
});

export const { setFilterType, setCurrentBoardId } = boardSlice.actions;
export default boardSlice.reducer;