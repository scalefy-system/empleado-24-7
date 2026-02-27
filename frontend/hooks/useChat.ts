import { useState, useCallback, useRef, useEffect } from 'react';
import { Message, ChatState } from '../types/chat';
import * as chatService from '../services/chatService';
import { BOT_WELCOME } from '../constants/chat';

const welcomeMessage: Message = {
  id: 'welcome',
  role: 'assistant',
  content: BOT_WELCOME,
  timestamp: new Date()
};

export const useChat = () => {
  const [state, setState] = useState<ChatState>({
    messages: [welcomeMessage],
    isOpen: false,
    isLoading: false,
    sessionId: null
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  const toggleChat = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true
    }));

    try {
      const { reply, sessionId } = await chatService.sendMessageToChat(content, state.sessionId);
      const botMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: reply,
        timestamp: new Date()
      };
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        sessionId,
        isLoading: false
      }));
    } catch {
      const errMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'El asistente no está disponible en este momento. Podés contactarnos al (011) 4823-5567.',
        timestamp: new Date()
      };
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errMsg],
        isLoading: false
      }));
    }
  }, [state.sessionId]);

  return { ...state, messagesEndRef, toggleChat, sendMessage };
};
