import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Tag, CreateTagPayload, UpdateTagPayload } from "../../types/tag.types";
import { tagService } from "./tag.service";

interface TagsState {
  items: Tag[];
  loading: boolean;
  error: string | null;
}

const initialState: TagsState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchTagsByTaskId = createAsyncThunk(
  "tags/fetchByTaskId",
  async (taskId: string) => {
    return await tagService.getTagsByTaskId(taskId);
  }
);

export const createTag = createAsyncThunk(
  "tags/create",
  async (payload: CreateTagPayload) => {
    return await tagService.createTag(payload);
  }
);

export const updateTag = createAsyncThunk(
  "tags/update",
  async (payload: UpdateTagPayload) => {
    return await tagService.updateTag(payload);
  }
);

export const deleteTag = createAsyncThunk(
  "tags/delete",
  async (tagId: string) => {
    await tagService.deleteTag(tagId);
    return tagId;
  }
);

const tagSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    clearTags: (state) => {
      state.items = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTagsByTaskId
      .addCase(fetchTagsByTaskId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTagsByTaskId.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTagsByTaskId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tags";
      })

      // createTag
      .addCase(createTag.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create tag";
      })

      // updateTag
      .addCase(updateTag.fulfilled, (state, action) => {
        const index = state.items.findIndex((tag) => tag.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTag.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update tag";
      })

      // deleteTag
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.items = state.items.filter((tag) => tag.id !== action.payload);
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete tag";
      });
  },
});

export const { clearTags, clearError } = tagSlice.actions;
export default tagSlice.reducer;