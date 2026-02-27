import { CHAT_API_URL } from '../constants/chat';

export const sendMessageToChat = async (
  message: string,
  sessionId: string | null
): Promise<{ reply: string; sessionId: string }> => {
  const res = await fetch(CHAT_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId })
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Error al conectar con el servidor' }));
    throw new Error(error.error || 'Error al conectar con el servidor');
  }
  
  return res.json();
};
