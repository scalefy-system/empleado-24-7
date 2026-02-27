'use client';
import { X, Sparkles } from 'lucide-react';
import { BOT_NAME } from '../../constants/chat';

export const ChatHeader = ({ onClose }: { onClose: () => void }) => (
  <div className="bg-charcoal px-4 py-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose to-rose-dark flex items-center justify-center">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-white font-medium text-sm">{BOT_NAME}</p>
        <p className="text-gray-light text-xs">Lumina Estética</p>
      </div>
    </div>
    <button
      onClick={onClose}
      className="p-2 hover:bg-white/10 rounded-full transition-colors"
      aria-label="Cerrar chat"
    >
      <X className="w-5 h-5 text-white" />
    </button>
  </div>
);
