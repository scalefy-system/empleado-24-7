const sessions = new Map();
const TTL = process.env.SESSION_TTL_MINUTES * 60 * 1000;
const MAX = parseInt(process.env.MAX_HISTORY_MESSAGES) || 20;

const getHistory = (sessionId) => {
  const session = sessions.get(sessionId);
  if (!session) return [];
  if (Date.now() - session.updatedAt > TTL) {
    sessions.delete(sessionId);
    return [];
  }
  return session.messages;
};

const addMessage = (sessionId, role, content) => {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, { messages: [], updatedAt: Date.now() });
  }
  const session = sessions.get(sessionId);
  session.messages.push({ role, content });
  if (session.messages.length > MAX) {
    session.messages = session.messages.slice(-MAX);
  }
  session.updatedAt = Date.now();
};

const deleteSession = (sessionId) => sessions.delete(sessionId);

module.exports = { getHistory, addMessage, deleteSession };
