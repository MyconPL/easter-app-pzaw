/**
 * Easter App 2026 – serwer główny
 * Własny micro-framework (bez zewnętrznych zależności)
 */
const path = require('path');
const createApp = require('./framework/app');
const { logger, securityHeaders, cors, rateLimit, timer, locale } = require('./middleware');
const registerRoutes = require('./routes');

const PORT = process.env.PORT || 3000;

// ── Inicjalizacja aplikacji ─────────────────────
const app = createApp();

// ── Katalogi ────────────────────────────────────
app.static(path.join(__dirname, 'public'));
app.views(path.join(__dirname, 'views'));

// ── Globalne zmienne szablonów ──────────────────
app.locals.year    = new Date().getFullYear();
app.locals.appName = 'Wielkanoc 2026';

// ── Middleware stack ────────────────────────────
app.use(timer);
app.use(logger);
app.use(securityHeaders);
app.use(cors);
app.use(rateLimit({ max: 200, windowMs: 60_000 }));
app.use(locale);

// ── Routes ──────────────────────────────────────
registerRoutes(app);

// ── Start ────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\x1b[32m');
  console.log('  🐣 ═══════════════════════════════════════');
  console.log('      Wielkanocny Serwer 2026');
  console.log('  ═══════════════════════════════════════');
  console.log(`  🌐  http://localhost:${PORT}`);
  console.log('  📋  Podstrony:');
  console.log(`       /          → Strona główna`);
  console.log(`       /jajka     → Polowanie na jajka`);
  console.log(`       /przepisy  → Przepisy`);
  console.log(`       /quiz      → Quiz wielkanocny`);
  console.log(`       /zyczenia  → Życzenia`);
  console.log(`       /o-stronie → O stronie + API docs`);
  console.log('  🔌  API:');
  console.log(`       /api/health   /api/recipes`);
  console.log(`       /api/eggs     /api/stats`);
  console.log('  🎮  Konami: ↑↑↓↓←→←→ dla niespodzianki!');
  console.log('  ═══════════════════════════════════════');
  console.log('\x1b[0m');
});
