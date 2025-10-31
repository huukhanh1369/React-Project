import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import boardReducer from "../features/board/BoardSlice";
import listReducer from "../features/list/listSlice";
import taskReducer from "../features/task/taskSlice";
import tagReducer from "../features/tag/tagSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    boards: boardReducer,
    lists: listReducer,
    tasks: taskReducer,
    tags: tagReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
