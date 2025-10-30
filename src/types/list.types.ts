import type { Task } from "./task.types";

export interface TaskList {
  id: string;
  title: string;
  boardId: string;
  tasks: Task[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateListPayload {
  title: string;
  boardId: string;
}

export interface UpdateListPayload {
  id: string;
  title?: string;
  order?: number;
}

export interface ListsState {
  items: TaskList[];
  loading: boolean;
  error: string | null;
  selectedList: TaskList | null;
}