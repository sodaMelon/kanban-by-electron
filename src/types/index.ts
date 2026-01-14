export interface Card {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
}

export interface Board {
  id: string;
  title: string;
  columns: Column[];
  createdAt: string;
}

export type BoardSummary = Pick<Board, 'id' | 'title' | 'createdAt'>;
