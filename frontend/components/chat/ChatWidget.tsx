'use client';
import { useChat } from '../../hooks/useChat';
import { ChatBubble } from './ChatBubble';
import { ChatWindow } from './ChatWindow';

export default function ChatWidget() {
  const chat = useChat();
  return (
    <>
      {chat.isOpen && <ChatWindow {...chat} />}
      <ChatBubble isOpen={chat.isOpen} onClick={chat.toggleChat} />
    </>
  );
}
