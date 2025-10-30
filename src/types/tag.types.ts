export interface Tag {
  id: string;
  name: string;
  color: string;
  taskId: string;
}

export interface CreateTagPayload {
  name: string;
  color: string;
  taskId: string;
}

export interface UpdateTagPayload {
  id: string;
  name?: string;
  color?: string;
}