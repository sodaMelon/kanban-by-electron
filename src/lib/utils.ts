export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function isOverdue(dateString: string): boolean {
  const dueDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dueDate < today;
}

export function getPriorityColor(priority: 'low' | 'medium' | 'high'): string {
  switch (priority) {
    case 'high':
      return 'bg-rose-100 text-rose-600 border-rose-200';
    case 'medium':
      return 'bg-amber-50 text-amber-600 border-amber-200';
    case 'low':
      return 'bg-teal-50 text-teal-600 border-teal-200';
  }
}
