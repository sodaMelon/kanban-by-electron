'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Board as BoardType, Column as ColumnType, Card as CardType } from '@/types';
import Column from './Column';
import Card from './Card';
import CardModal from './CardModal';
import { generateId } from '@/lib/utils';

interface BoardProps {
  board: BoardType;
  onUpdateBoard: (board: BoardType) => void;
}

export default function Board({ board, onUpdateBoard }: BoardProps) {
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const findColumnByCardId = (cardId: string): ColumnType | undefined => {
    return board.columns.find(col => col.cards.some(card => card.id === cardId));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const column = findColumnByCardId(active.id as string);
    if (column) {
      const card = column.cards.find(c => c.id === active.id);
      if (card) setActiveCard(card);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = findColumnByCardId(activeId);
    let overColumn = findColumnByCardId(overId);

    if (!overColumn) {
      overColumn = board.columns.find(col => col.id === overId);
    }

    if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) return;

    const activeCard = activeColumn.cards.find(c => c.id === activeId);
    if (!activeCard) return;

    const newColumns = board.columns.map(col => {
      if (col.id === activeColumn.id) {
        return {
          ...col,
          cards: col.cards.filter(c => c.id !== activeId),
        };
      }
      if (col.id === overColumn!.id) {
        const overCardIndex = col.cards.findIndex(c => c.id === overId);
        const newCards = [...col.cards];
        if (overCardIndex >= 0) {
          newCards.splice(overCardIndex, 0, activeCard);
        } else {
          newCards.push(activeCard);
        }
        return {
          ...col,
          cards: newCards,
        };
      }
      return col;
    });

    onUpdateBoard({ ...board, columns: newColumns });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeColumn = findColumnByCardId(activeId);
    if (!activeColumn) return;

    const activeIndex = activeColumn.cards.findIndex(c => c.id === activeId);
    const overIndex = activeColumn.cards.findIndex(c => c.id === overId);

    if (activeIndex !== -1 && overIndex !== -1) {
      const newColumns = board.columns.map(col => {
        if (col.id === activeColumn.id) {
          return {
            ...col,
            cards: arrayMove(col.cards, activeIndex, overIndex),
          };
        }
        return col;
      });

      onUpdateBoard({ ...board, columns: newColumns });
    }
  };

  const handleUpdateColumn = (updatedColumn: ColumnType) => {
    const newColumns = board.columns.map(col =>
      col.id === updatedColumn.id ? updatedColumn : col
    );
    onUpdateBoard({ ...board, columns: newColumns });
  };

  const handleDeleteColumn = (columnId: string) => {
    const newColumns = board.columns.filter(col => col.id !== columnId);
    onUpdateBoard({ ...board, columns: newColumns });
  };

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;

    const newColumn: ColumnType = {
      id: generateId(),
      title: newColumnTitle.trim(),
      cards: [],
    };

    onUpdateBoard({ ...board, columns: [...board.columns, newColumn] });
    setNewColumnTitle('');
    setIsAddingColumn(false);
  };

  const handleCardClick = (card: CardType, columnId: string) => {
    setSelectedCard(card);
    setSelectedColumnId(columnId);
  };

  const handleUpdateCard = (updatedCard: CardType) => {
    if (!selectedColumnId) return;

    const newColumns = board.columns.map(col => {
      if (col.id === selectedColumnId) {
        return {
          ...col,
          cards: col.cards.map(card =>
            card.id === updatedCard.id ? updatedCard : card
          ),
        };
      }
      return col;
    });

    onUpdateBoard({ ...board, columns: newColumns });
  };

  const handleDeleteCard = (cardId: string) => {
    if (!selectedColumnId) return;

    const newColumns = board.columns.map(col => {
      if (col.id === selectedColumnId) {
        return {
          ...col,
          cards: col.cards.filter(card => card.id !== cardId),
        };
      }
      return col;
    });

    onUpdateBoard({ ...board, columns: newColumns });
    setSelectedCard(null);
    setSelectedColumnId(null);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1 items-start">
          {board.columns.map(column => (
            <Column
              key={column.id}
              column={column}
              onUpdateColumn={handleUpdateColumn}
              onDeleteColumn={handleDeleteColumn}
              onCardClick={(card) => handleCardClick(card, column.id)}
            />
          ))}

          {isAddingColumn ? (
            <form
              onSubmit={handleAddColumn}
              className="flex-shrink-0 w-72 bg-white/60 backdrop-blur-sm rounded-2xl p-3 border border-pink-200"
            >
              <input
                type="text"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                placeholder="컬럼 이름을 입력하세요"
                className="w-full px-3 py-2 text-sm border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
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
                    setIsAddingColumn(false);
                    setNewColumnTitle('');
                  }}
                  className="flex-1 bg-gray-100 text-gray-500 text-sm py-1.5 rounded-xl hover:bg-gray-200"
                >
                  취소
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingColumn(true)}
              className="flex-shrink-0 w-72 py-3 bg-white/40 hover:bg-white/60 rounded-2xl text-gray-400 hover:text-pink-500 flex items-center justify-center gap-2 transition-colors border-2 border-dashed border-pink-200 hover:border-pink-300"
            >
              <Plus className="w-5 h-5" />
              컬럼 추가
            </button>
          )}
        </div>

        <DragOverlay>
          {activeCard ? (
            <div className="rotate-3">
              <Card card={activeCard} onClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={() => {
            setSelectedCard(null);
            setSelectedColumnId(null);
          }}
          onUpdate={handleUpdateCard}
          onDelete={handleDeleteCard}
        />
      )}
    </>
  );
}
