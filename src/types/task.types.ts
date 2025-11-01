export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  listId: string;
  position: string;
  tags?: string[]; // Array of tag IDs
  startDate?: string | null; // ISO format date string
  dueDate?: string | null; // ISO format date string
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  listId: string;
  description?: string;
}

export interface UpdateTaskPayload {
  id: string;
  title?: string;
  description?: string;
  completed?: boolean;
  position?: string;
  startDate?: string | null;
  dueDate?: string | null;
}