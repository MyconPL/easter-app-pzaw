/**
 * Routes – wszystkie ścieżki aplikacji
 */
const { recipes, eggs, wishes, quizQuestions } = require('../data');

// Stan gry (in-memory, per-session via query param)
const gameStore = new Map();

function getGame(id) {
  if (!gameStore.has(id)) {
    gameStore.set(id, { found: [], points: 0, startedAt: Date.now() });
  }
  return gameStore.get(id);
}

module.exports = (app) => {

  // ────────────────────────────────────────────────────────────
  // PAGE ROUTES
  // ────────────────────────────────────────────────────────────

  // HOME
  app.get('/', (req, res) => {
    res.render('pages/home.html', {
      title: 'Wesołych Świąt Wielkanocnych 2026',
      wishes: wishes.slice(0, 4),
      totalRecipes: recipes.length,
      totalEggs: eggs.length,
    });
  });

  // POLOWANIE NA JAJKA
  app.get('/jajka', (req, res) => {
    const sessionId = req.query.s || Math.random().toString(36).slice(2);
    const game = getGame(sessionId);
    res.render('pages/eggs.html', {
      title: 'Polowanie na Jajka 🥚',
      eggs: eggs,
      sessionId,
      found: game.found,
      points: game.points,
    });
  });

  // PRZEPISY – lista
  app.get('/przepisy', (req, res) => {
    const { kategoria, q } = req.query;
    let filtered = [...recipes];
    if (kategoria) filtered = filtered.filter(r => r.category === kategoria);
    if (q) {
      const qLow = q.toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(qLow) ||
        r.desc.toLowerCase().includes(qLow) ||
        r.tags.some(t => t.toLowerCase().includes(qLow))
      );
    }
    const categories = [...new Set(recipes.map(r => r.category))];
    res.render('pages/recipes.html', {
      title: 'Wielkanocne Przepisy 🍳',
      recipes: filtered,
      categories,
      activeCategory: kategoria || '',
      searchQuery: q || '',
      count: filtered.length,
    });
  });

  // PRZEPIS – szczegół
  app.get('/przepisy/:id', (req, res) => {
    const recipe = recipes.find(r => r.id === req.params.id);
    if (!recipe) { res.status(404).render('pages/404.html', { title: '404' }); return; }
    const related = recipes.filter(r => r.id !== recipe.id && r.category === recipe.category).slice(0, 2);
    res.render('pages/recipe-detail.html', { title: recipe.name, recipe, related });
  });

  // QUIZ WIELKANOCNY
  app.get('/quiz', (req, res) => {
    res.render('pages/quiz.html', {
      title: 'Quiz Wielkanocny 🧠',
      totalQuestions: quizQuestions.length,
    });
  });

  // ŻYCZENIA
  app.get('/zyczenia', (req, res) => {
    res.render('pages/wishes.html', {
      title: 'Wielkanocne Życzenia 💐',
      wishes,
    });
  });

  // O STRONIE
  app.get('/o-stronie', (req, res) => {
    res.render('pages/about.html', {
      title: 'O Stronie 🐰',
      version: '2.0.0',
      routes: [
        { path: '/', desc: 'Strona główna' },
        { path: '/jajka', desc: 'Polowanie na jajka' },
        { path: '/przepisy', desc: 'Wielkanocne przepisy' },
        { path: '/quiz', desc: 'Quiz wiedzy' },
        { path: '/zyczenia', desc: 'Świąteczne życzenia' },
      ],
    });
  });

  // ────────────────────────────────────────────────────────────
  // API ROUTES
  // ────────────────────────────────────────────────────────────

  // API – lista przepisów
  app.get('/api/recipes', (req, res) => {
    const { cat } = req.query;
    const data = cat ? recipes.filter(r => r.category === cat) : recipes;
    res.json({ ok: true, count: data.length, data });
  });

  // API – pojedynczy przepis
  app.get('/api/recipes/:id', (req, res) => {
    const recipe = recipes.find(r => r.id === req.params.id);
    if (!recipe) { res.status(404).json({ ok: false, error: 'Not found' }); return; }
    res.json({ ok: true, data: recipe });
  });

  // API – jajka
  app.get('/api/eggs', (req, res) => {
    res.json({ ok: true, count: eggs.length, data: eggs });
  });

  // API – zbierz jajko
  app.post('/api/eggs/collect', (req, res) => {
    const { eggId, sessionId } = req.body || {};
    if (!eggId || !sessionId) {
      res.status(400).json({ ok: false, error: 'Brak eggId lub sessionId' }); return;
    }
    const egg = eggs.find(e => e.id === Number(eggId));
    if (!egg) { res.status(404).json({ ok: false, error: 'Nieznane jajko' }); return; }

    const game = getGame(sessionId);
    if (game.found.includes(Number(eggId))) {
      res.json({ ok: true, alreadyFound: true, game }); return;
    }
    game.found.push(Number(eggId));
    game.points += egg.points;
    const victory = game.found.length === eggs.length;
    res.json({ ok: true, egg, game, victory });
  });

  // API – stan gry
  app.get('/api/game/:sessionId', (req, res) => {
    const game = getGame(req.params.sessionId);
    res.json({ ok: true, game, totalEggs: eggs.length });
  });

  // API – reset gry
  app.post('/api/game/:sessionId/reset', (req, res) => {
    gameStore.set(req.params.sessionId, { found: [], points: 0, startedAt: Date.now() });
    res.json({ ok: true, message: 'Gra zresetowana' });
  });

  // API – quiz (losowe pytania)
  app.get('/api/quiz', (req, res) => {
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);
    // Nie wysyłaj poprawnych odpowiedzi do klienta
    const safe = shuffled.map(({ q, answers }) => ({ q, answers }));
    res.json({ ok: true, questions: safe });
  });

  // API – sprawdź odpowiedź quizu
  app.post('/api/quiz/check', (req, res) => {
    const { questionIdx, answer } = req.body || {};
    const q = quizQuestions[questionIdx];
    if (!q) { res.status(400).json({ ok: false, error: 'Złe indeks pytania' }); return; }
    const correct = answer === q.correct;
    res.json({ ok: true, correct, correctAnswer: q.correct, fun: q.fun });
  });

  // API – życzenia
  app.get('/api/wishes', (req, res) => {
    res.json({ ok: true, data: wishes });
  });

  // API – losowe życzenie
  app.get('/api/wishes/random', (req, res) => {
    const wish = wishes[Math.floor(Math.random() * wishes.length)];
    res.json({ ok: true, data: wish });
  });

  // API – health check
  app.get('/api/health', (req, res) => {
    res.json({
      ok: true,
      status: 'healthy',
      uptime: Math.floor(process.uptime()),
      requestId: req.requestId,
      timestamp: new Date().toISOString(),
    });
  });

  // API – statystyki
  app.get('/api/stats', (req, res) => {
    const games = [...gameStore.values()];
    res.json({
      ok: true,
      stats: {
        activeSessions: gameStore.size,
        totalCollections: games.reduce((a, g) => a + g.found.length, 0),
        totalPoints: games.reduce((a, g) => a + g.points, 0),
        recipes: recipes.length,
        eggs: eggs.length,
        wishes: wishes.length,
      },
    });
  });
};
