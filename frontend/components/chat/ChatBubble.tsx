'use client';
import { MessageCircle, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClick: () => void;
}

export const ChatBubble = ({ isOpen, onClick }: Props) => (
  <button
    onClick={onClick}
    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-rose shadow-card-hover flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl"
    aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
  >
    {isOpen ? (
      <X className="w-7 h-7 text-white" />
    ) : (
      <MessageCircle className="w-7 h-7 text-white" />
    )}
  </button>
);
