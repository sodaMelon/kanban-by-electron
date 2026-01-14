'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Flag } from 'lucide-react';
import { Card as CardType } from '@/types';
import { formatDate, isOverdue, getPriorityColor } from '@/lib/utils';

interface CardProps {
  card: CardType;
  onClick: () => void;
}

export default function Card({ card, onClick }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityLabels = {
    low: '낮음',
    medium: '보통',
    high: '높음',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`bg-white rounded-xl p-3 shadow-sm border border-pink-100 cursor-pointer hover:shadow-md hover:border-pink-200 transition-all ${
        isDragging ? 'opacity-50 shadow-lg rotate-2' : ''
      }`}
    >
      <h4 className="font-medium text-gray-700 mb-2">{card.title}</h4>

      {card.description && (
        <p className="text-sm text-gray-400 mb-2 line-clamp-2">{card.description}</p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(card.priority)} flex items-center gap-1`}>
          <Flag className="w-3 h-3" />
          {priorityLabels[card.priority]}
        </span>

        {card.dueDate && (
          <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
            isOverdue(card.dueDate)
              ? 'bg-rose-50 text-rose-500'
              : 'bg-purple-50 text-purple-500'
          }`}>
            <Calendar className="w-3 h-3" />
            {formatDate(card.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
}
