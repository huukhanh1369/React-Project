import type { Tag } from "./tag.types";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  listId: string;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  listId: string;
}

export interface UpdateTaskPayload {
  id: string;
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface TasksState {
  items: Task[];
  loading: boolean;
  error: string | null;
  selectedTask: Task | null;
}