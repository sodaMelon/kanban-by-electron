'use client';

import { useParams } from 'next/navigation';
import { ArrowLeft, Pencil, Check, X, Heart } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Board as BoardType } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import BoardComponent from '@/components/Board';

export default function BoardPage() {
  const params = useParams();
  const boardId = params.id as string;

  const [boards, setBoards] = useLocalStorage<BoardType[]>('kanban-boards', []);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  const board = boards.find(b => b.id === boardId);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (board) {
      setEditedTitle(board.title);
    }
  }, [board]);

  const handleUpdateBoard = (updatedBoard: BoardType) => {
    setBoards(boards.map(b => (b.id === updatedBoard.id ? updatedBoard : b)));
  };

  const handleUpdateTitle = () => {
    if (board && editedTitle.trim() && editedTitle !== board.title) {
      handleUpdateBoard({ ...board, title: editedTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-rose-300 to-purple-300 flex items-center justify-center">
        <div className="text-white text-lg flex items-center gap-2">
          <Heart className="w-5 h-5 animate-pulse" />
          로딩 중...
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-rose-300 to-purple-300 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center border border-pink-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">보드를 찾을 수 없습니다</h2>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-600"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-rose-300 to-purple-300 flex flex-col">
      <header className="bg-white/20 backdrop-blur-sm px-6 py-4 border-b border-white/30">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="px-3 py-1 text-xl font-bold bg-white/20 border border-white/40 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUpdateTitle();
                  if (e.key === 'Escape') {
                    setEditedTitle(board.title);
                    setIsEditingTitle(false);
                  }
                }}
              />
              <button
                onClick={handleUpdateTitle}
                className="p-1 text-white hover:bg-white/20 rounded-lg"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setEditedTitle(board.title);
                  setIsEditingTitle(false);
                }}
                className="p-1 text-white/70 hover:text-white hover:bg-white/20 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="flex items-center gap-2 text-xl font-bold text-white hover:bg-white/20 px-3 py-1 rounded-xl transition-colors group"
            >
              {board.title}
              <Pencil className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 p-6 overflow-hidden flex flex-col">
        <BoardComponent board={board} onUpdateBoard={handleUpdateBoard} />
      </main>
    </div>
  );
}
