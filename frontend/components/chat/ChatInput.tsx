'use client';
import { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface Props {
  onSend: (msg: string) => void;
  isLoading: boolean;
}

export const ChatInput = ({ onSend, isLoading }: Props) => {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (!value.trim() || isLoading) return;
    onSend(value.trim());
    setValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 bg-white border-t border-cream-border">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribí tu mensaje..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 bg-cream rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose/20 focus:bg-white transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          className="w-12 h-12 rounded-xl bg-rose flex items-center justify-center text-white hover:bg-rose-dark disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-rose transition-all duration-200"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
