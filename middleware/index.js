/**
 * Middleware stack dla Easter App
 */

// ── Logger ──────────────────────────────────────────────────────
const logger = (req, res, next) => {
  const start = Date.now();
  const id = Math.random().toString(36).slice(2, 8).toUpperCase();
  req.requestId = id;

  // Nadpisz end żeby złapać kod statusu
  const origEnd = res.end.bind(res);
  res.end = (...args) => {
    const ms = Date.now() - start;
    const status = res.statusCode;
    const color = status < 300 ? '\x1b[32m' : status < 400 ? '\x1b[33m' : '\x1b[31m';
    const reset = '\x1b[0m';
    const time = new Date().toISOString().slice(11, 19);
    console.log(`${color}[${time}] [${id}] ${req.method} ${req.path} → ${status} (${ms}ms)${reset}`);
    return origEnd(...args);
  };
  next();
};

// ── Security headers ────────────────────────────────────────────
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Request-Id', req.requestId || 'unknown');
  next();
};

// ── CORS (opcjonalny) ───────────────────────────────────────────
const cors = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
  next();
};

// ── Rate limiter (prosty, in-memory) ────────────────────────────
const rateLimit = (opts = {}) => {
  const { max = 100, windowMs = 60000 } = opts;
  const store = new Map();

  return (req, res, next) => {
    const key = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = store.get(key) || { count: 0, reset: now + windowMs };

    if (now > entry.reset) { entry.count = 0; entry.reset = now + windowMs; }
    entry.count++;
    store.set(key, entry);

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - entry.count));

    if (entry.count > max) {
      res.status(429).json({ error: 'Too Many Requests', retryAfter: Math.ceil((entry.reset - now) / 1000) });
      return;
    }
    next();
  };
};

// ── Request timer (dodaje req.startTime) ────────────────────────
const timer = (req, res, next) => {
  req.startTime = Date.now();
  next();
};

// ── Lokalizacja / i18n hint ─────────────────────────────────────
const locale = (req, res, next) => {
  const lang = req.headers['accept-language'] || 'pl';
  req.lang = lang.startsWith('pl') ? 'pl' : 'en';
  next();
};

module.exports = { logger, securityHeaders, cors, rateLimit, timer, locale };
