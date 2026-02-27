export const CHAT_API_URL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/chat`
  : 'http://localhost:3001/api/chat';

export const BOT_NAME = 'Luna';
export const BOT_WELCOME = '¡Hola! Soy Luna, tu asistente personal de Lumina Estética 🌸 ¿En qué puedo ayudarte hoy?';
