'use client';
import { Message } from '../../types/chat';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';

interface Props {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  sendMessage: (content: string) => void;
  toggleChat: () => void;
}

export const ChatWindow = ({ messages, isLoading, messagesEndRef, sendMessage, toggleChat }: Props) => (
  <div
    className="fixed bottom-24 right-6 z-50 w-[380px] h-[580px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
    style={{
      animation: 'chatSlideIn 0.3s ease-out'
    }}
  >
    <style jsx>{`
      @keyframes chatSlideIn {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `}</style>
    <ChatHeader onClose={toggleChat} />
    <ChatMessages messages={messages} isLoading={isLoading} messagesEndRef={messagesEndRef} />
    <ChatInput onSend={sendMessage} isLoading={isLoading} />
  </div>
);
