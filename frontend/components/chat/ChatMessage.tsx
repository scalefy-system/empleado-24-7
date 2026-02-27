'use client';
import { Message } from '../../types/chat';

export const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm break-words ${
          isUser
            ? 'bg-rose text-white rounded-br-md'
            : 'bg-white text-charcoal border border-cream-border rounded-bl-md shadow-sm'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};
