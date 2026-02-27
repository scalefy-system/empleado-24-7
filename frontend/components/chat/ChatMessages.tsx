'use client';
import { Message } from '../../types/chat';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';

interface Props {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatMessages = ({ messages, isLoading, messagesEndRef }: Props) => (
  <div className="flex-1 overflow-y-auto p-4 bg-cream flex flex-col gap-3">
    {messages.map((msg) => (
      <ChatMessage key={msg.id} message={msg} />
    ))}
    {isLoading && <TypingIndicator />}
    <div ref={messagesEndRef} />
  </div>
);
