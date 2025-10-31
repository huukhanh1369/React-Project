import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { TaskList, CreateListPayload, UpdateListPayload, ListsState } from "../../types/list.types";
import { listService } from "./list.service";

const initialState: ListsState = {
  items: [],
  loading: false,
  error: null,
  selectedList: null,
};

// Async thunks
export const fetchListsByBoardId = createAsyncThunk(
  "lists/fetchByBoardId",
  async (boardId: string) => {
    return await listService.getListsByBoardId(boardId);
  }
);

export const fetchListById = createAsyncThunk(
  "lists/fetchById",
  async (listId: string) => {
    return await listService.getListById(listId);
  }
);

export const createList = createAsyncThunk(
  "lists/create",
  async (payload: CreateListPayload) => {
    return await listService.createList(payload);
  }
);

export const updateList = createAsyncThunk(
  "lists/update",
  async (payload: UpdateListPayload) => {
    return await listService.updateList(payload);
  }
);

export const deleteList = createAsyncThunk(
  "lists/delete",
  async (listId: string) => {
    await listService.deleteList(listId);
    return listId;
  }
);

const listSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    clearLists: (state) => {
      state.items = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSelectedList: (state, action) => {
      state.selectedList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchListsByBoardId
      .addCase(fetchListsByBoardId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListsByBoardId.fulfilled, (state, action) => {
        state.loading = false;
        // Sắp xếp theo order
        state.items = action.payload.sort((a, b) => a.order - b.order);
      })
      .addCase(fetchListsByBoardId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch lists";
      })

      // fetchListById
      .addCase(fetchListById.fulfilled, (state, action) => {
        state.selectedList = action.payload;
      })

      // createList
      .addCase(createList.pending, (state) => {
        state.loading = true;
      })
      .addCase(createList.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        // Sắp xếp lại theo order
        state.items.sort((a, b) => a.order - b.order);
      })
      .addCase(createList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create list";
      })

      // updateList
      .addCase(updateList.fulfilled, (state, action) => {
        const index = state.items.findIndex((list) => list.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
          // Sắp xếp lại nếu order thay đổi
          state.items.sort((a, b) => a.order - b.order);
        }
        if (state.selectedList?.id === action.payload.id) {
          state.selectedList = action.payload;
        }
      })
      .addCase(updateList.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update list";
      })

      // deleteList
      .addCase(deleteList.fulfilled, (state, action) => {
        state.items = state.items.filter((list) => list.id !== action.payload);
        if (state.selectedList?.id === action.payload) {
          state.selectedList = null;
        }
      })
      .addCase(deleteList.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete list";
      });
  },
});

export const { clearLists, clearError, setSelectedList } = listSlice.actions;
export default listSlice.reducer;