const { v4: uuidv4 } = require('uuid');
const sessionService = require('../services/sessionService');
const openaiService = require('../services/openaiService');
const { getSystemPrompt } = require('../prompts/systemPrompt');

const sendMessage = async (req, res) => {
  try {
    const { message, sessionId = uuidv4() } = req.body;

    const history = sessionService.getHistory(sessionId);
    sessionService.addMessage(sessionId, 'user', message);

    const reply = await openaiService.sendMessage(
      [...history, { role: 'user', content: message }],
      getSystemPrompt()
    );

    sessionService.addMessage(sessionId, 'assistant', reply);
    res.json({ reply, sessionId });

  } catch (error) {
    console.error('Error en chat:', error.message);
    res.status(500).json({ error: 'Error al procesar tu consulta.' });
  }
};

const resetSession = (req, res) => {
  sessionService.deleteSession(req.params.sessionId);
  res.json({ message: 'Sesión reiniciada' });
};

module.exports = { sendMessage, resetSession };
