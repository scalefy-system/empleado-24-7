const validateChat = (req, res, next) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Mensaje inválido.' });
  }
  if (message.trim().length === 0) {
    return res.status(400).json({ error: 'El mensaje no puede estar vacío.' });
  }
  if (message.length > 1000) {
    return res.status(400).json({ error: 'Mensaje demasiado largo (máx. 1000 chars).' });
  }
  req.body.message = message.trim();
  next();
};

module.exports = { validateChat };
