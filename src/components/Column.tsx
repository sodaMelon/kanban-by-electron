'use client';

import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, MoreHorizontal, Pencil, Trash2, X, Check } from 'lucide-react';
import { Column as ColumnType, Card as CardType } from '@/types';
import Card from './Card';
import { generateId } from '@/lib/utils';

interface ColumnProps {
  column: ColumnType;
  onUpdateColumn: (column: ColumnType) => void;
  onDeleteColumn: (columnId: string) => void;
  onCardClick: (card: CardType) => void;
}

export default function Column({ column, onUpdateColumn, onDeleteColumn, onCardClick }: ColumnProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);
  const [showMenu, setShowMenu] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;

    const newCard: CardType = {
      id: generateId(),
      title: newCardTitle.trim(),
      priority: 'medium',
      createdAt: new Date().toISOString(),
    };

    onUpdateColumn({
      ...column,
      cards: [...column.cards, newCard],
    });

    setNewCardTitle('');
    setIsAddingCard(false);
  };

  const handleUpdateTitle = () => {
    if (editedTitle.trim() && editedTitle !== column.title) {
      onUpdateColumn({
        ...column,
        title: editedTitle.trim(),
      });
    }
    setIsEditingTitle(false);
  };

  return (
    <div
      className={`flex-shrink-0 w-72 bg-white/70 backdrop-blur-sm rounded-2xl p-3 flex flex-col max-h-full border border-pink-100 ${
        isOver ? 'ring-2 ring-pink-300' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        {isEditingTitle ? (
          <div className="flex items-center gap-1 flex-1">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="flex-1 px-2 py-1 text-sm font-semibold rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUpdateTitle();
                if (e.key === 'Escape') {
                  setEditedTitle(column.title);
                  setIsEditingTitle(false);
                }
              }}
            />
            <button onClick={handleUpdateTitle} className="p-1 text-pink-500 hover:bg-pink-50 rounded">
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setEditedTitle(column.title);
                setIsEditingTitle(false);
              }}
              className="p-1 text-gray-400 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-semibold text-gray-600 flex items-center gap-2">
              {column.title}
              <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">
                {column.cards.length}
              </span>
            </h3>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-gray-300 hover:text-gray-500 hover:bg-pink-50 rounded"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-pink-100 py-1 z-10 min-w-[120px]">
                  <button
                    onClick={() => {
                      setIsEditingTitle(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-600 hover:bg-pink-50 flex items-center gap-2"
                  >
                    <Pencil className="w-3 h-3" />
                    이름 수정
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('이 컬럼을 삭제하시겠습니까? 모든 카드도 함께 삭제됩니다.')) {
                        onDeleteColumn(column.id);
                      }
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-3 h-3" />
                    삭제
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto space-y-2 min-h-[100px]"
      >
        <SortableContext items={column.cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {column.cards.map(card => (
            <Card key={card.id} card={card} onClick={() => onCardClick(card)} />
          ))}
        </SortableContext>
      </div>

      {isAddingCard ? (
        <form onSubmit={handleAddCard} className="mt-2">
          <textarea
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="카드 제목을 입력하세요..."
            className="w-full px-3 py-2 text-sm border border-pink-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-300"
            rows={2}
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="flex-1 bg-pink-400 text-white text-sm py-1.5 rounded-xl hover:bg-pink-500"
            >
              추가
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingCard(false);
                setNewCardTitle('');
              }}
              className="flex-1 bg-gray-100 text-gray-500 text-sm py-1.5 rounded-xl hover:bg-gray-200"
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAddingCard(true)}
          className="mt-2 w-full py-2 text-sm text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-xl flex items-center justify-center gap-1 transition-colors"
        >
          <Plus className="w-4 h-4" />
          카드 추가
        </button>
      )}
    </div>
  );
}
