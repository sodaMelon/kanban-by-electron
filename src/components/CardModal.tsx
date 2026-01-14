'use client';

import { useState } from 'react';
import { X, Trash2, Calendar, Flag, AlignLeft } from 'lucide-react';
import { Card } from '@/types';
import { formatDate } from '@/lib/utils';

interface CardModalProps {
  card: Card;
  onClose: () => void;
  onUpdate: (card: Card) => void;
  onDelete: (cardId: string) => void;
}

export default function CardModal({ card, onClose, onUpdate, onDelete }: CardModalProps) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [dueDate, setDueDate] = useState(card.dueDate || '');
  const [priority, setPriority] = useState(card.priority);

  const handleSave = () => {
    onUpdate({
      ...card,
      title: title.trim() || card.title,
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      priority,
    });
    onClose();
  };

  const handleDelete = () => {
    if (confirm('이 카드를 삭제하시겠습니까?')) {
      onDelete(card.id);
    }
  };

  const priorityOptions: { value: Card['priority']; label: string }[] = [
    { value: 'low', label: '낮음' },
    { value: 'medium', label: '보통' },
    { value: 'high', label: '높음' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-xl border border-pink-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-pink-100">
          <h2 className="text-lg font-semibold text-gray-700">카드 편집</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-300 hover:text-gray-500 hover:bg-pink-50 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="카드 제목"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
              <AlignLeft className="w-4 h-4 text-pink-400" />
              설명
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
              placeholder="카드에 대한 상세 설명을 입력하세요..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-pink-400" />
                마감일
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                <Flag className="w-4 h-4 text-pink-400" />
                우선순위
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Card['priority'])}
                className="w-full px-3 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                {priorityOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-400">
            생성일: {formatDate(card.createdAt)}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-pink-100 bg-pink-50/50 rounded-b-2xl">
          <button
            onClick={handleDelete}
            className="px-3 py-2 text-red-400 hover:bg-red-50 rounded-xl flex items-center gap-1 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            삭제
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl text-sm"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-pink-400 text-white rounded-xl hover:bg-pink-500 text-sm"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
