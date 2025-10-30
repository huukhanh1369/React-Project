export interface Board {
  id: string;
  userId: number;
  title: string;
  background?: string;
  color?: string;
  isStarred?: boolean;
  isClosed?: boolean;
  createdAt: string;
}