const requests = new Map();

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000;
  const maxReqs = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 20;

  if (!requests.has(ip)) requests.set(ip, []);
  const timestamps = requests.get(ip).filter(t => now - t < windowMs);
  timestamps.push(now);
  requests.set(ip, timestamps);

  if (timestamps.length > maxReqs) {
    return res.status(429).json({ error: 'Demasiadas solicitudes. Esperá un momento.' });
  }

  next();
};

module.exports = { rateLimiter };
