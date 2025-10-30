import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import boardReducer from "./boards/BoardSlice";
import listReducer from "./lists/listSlice";
import taskReducer from "./tasks/taskSlice";
import tagReducer from "./tags/tagSlice";

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
