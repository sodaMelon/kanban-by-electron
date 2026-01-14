'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Heart } from 'lucide-react';
import { Board, Column } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generateId, formatDate } from '@/lib/utils';

const DEFAULT_COLUMNS: Omit<Column, 'id'>[] = [
  { title: 'To Do', cards: [] },
  { title: 'In Progress', cards: [] },
  { title: 'Done', cards: [] },
];

export default function BoardList() {
  const [boards, setBoards] = useLocalStorage<Board[]>('kanban-boards', []);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;

    const newBoard: Board = {
      id: generateId(),
      title: newBoardTitle.trim(),
      columns: DEFAULT_COLUMNS.map(col => ({
        ...col,
        id: generateId(),
      })),
      createdAt: new Date().toISOString(),
    };

    setBoards([...boards, newBoard]);
    setNewBoardTitle('');
    setIsCreating(false);
  };

  const handleDeleteBoard = (boardId: string) => {
    if (confirm('정말로 이 보드를 삭제하시겠습니까?')) {
      setBoards(boards.filter(board => board.id !== boardId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100">
      <div className="max-w-6xl mx-auto p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-700 flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-400 fill-pink-200" />
            프로젝트 관리
          </h1>
          <p className="text-gray-500 mt-2">보드를 선택하거나 새로운 보드를 만들어 시작하세요</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map(board => (
            <div
              key={board.id}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-lg transition-all p-6 border border-pink-100"
            >
              <Link href={`/board/${board.id}`} className="block">
                <h2 className="text-xl font-semibold text-gray-700 mb-2 group-hover:text-pink-500 transition-colors">
                  {board.title}
                </h2>
                <p className="text-sm text-gray-400">
                  생성일: {formatDate(board.createdAt)}
                </p>
                <div className="flex gap-2 mt-4">
                  {board.columns.map(col => (
                    <span
                      key={col.id}
                      className="text-xs bg-pink-50 text-pink-600 px-2 py-1 rounded-full"
                    >
                      {col.title}: {col.cards.length}
                    </span>
                  ))}
                </div>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteBoard(board.id);
                }}
                className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                title="보드 삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {isCreating ? (
            <form
              onSubmit={handleCreateBoard}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border-2 border-pink-200"
            >
              <input
                type="text"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                placeholder="보드 이름을 입력하세요"
                className="w-full px-4 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 mb-4"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-pink-400 text-white py-2 rounded-xl hover:bg-pink-500 transition-colors"
                >
                  생성
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewBoardTitle('');
                  }}
                  className="flex-1 bg-gray-100 text-gray-500 py-2 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center justify-center gap-2 bg-white/50 rounded-2xl border-2 border-dashed border-pink-200 p-6 text-gray-400 hover:border-pink-400 hover:text-pink-500 hover:bg-white/80 transition-all min-h-[160px]"
            >
              <Plus className="w-6 h-6" />
              <span className="font-medium">새 보드 만들기</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
