/**
 * MiniExpress – własny micro-framework inspirowany Express.js
 * Routing, middleware stack, template engine, static files
 */
const http = require('http');
const url  = require('url');
const path = require('path');
const fs   = require('fs');

class Router {
  constructor() {
    this.routes = [];
  }

  _add(method, pattern, ...handlers) {
    // Konwertuj :param na named capture groups
    const keys = [];
    const regexStr = pattern
      .replace(/:([a-zA-Z_]+)/g, (_, k) => { keys.push(k); return '([^/]+)'; })
      .replace(/\//g, '\\/');
    const regex = new RegExp(`^${regexStr}$`);
    this.routes.push({ method, regex, keys, handlers });
  }

  get(p, ...h)    { this._add('GET',    p, ...h); }
  post(p, ...h)   { this._add('POST',   p, ...h); }
  put(p, ...h)    { this._add('PUT',    p, ...h); }
  delete(p, ...h) { this._add('DELETE', p, ...h); }

  match(method, pathname) {
    for (const route of this.routes) {
      if (route.method !== method && route.method !== '*') continue;
      const m = pathname.match(route.regex);
      if (!m) continue;
      const params = {};
      route.keys.forEach((k, i) => params[k] = decodeURIComponent(m[i + 1]));
      return { handlers: route.handlers, params };
    }
    return null;
  }
}

class MiniExpress {
  constructor() {
    this.middlewares = [];
    this.router      = new Router();
    this._staticDirs = [];
    this._viewsDir   = null;
    this.locals      = {};                 // globalne zmienne szablonów
  }

  // ── Middleware ──────────────────────────────────────────────
  use(fn) { this.middlewares.push(fn); return this; }

  // ── Routing shortcuts ───────────────────────────────────────
  get(p, ...h)    { this.router.get(p, ...h);    return this; }
  post(p, ...h)   { this.router.post(p, ...h);   return this; }
  put(p, ...h)    { this.router.put(p, ...h);    return this; }
  delete(p, ...h) { this.router.delete(p, ...h); return this; }

  // ── Konfiguracja ────────────────────────────────────────────
  static(dir) { this._staticDirs.push(dir); return this; }
  views(dir)  { this._viewsDir = dir;       return this; }

  // ── Mini template engine ────────────────────────────────────
  _render(template, data = {}) {
    const vars = { ...this.locals, ...data };
    let out = template;

    // {{#if condition}} ... {{/if}}
    out = out.replace(/\{\{#if\s+(.+?)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, cond, block) => {
      try { return new Function(...Object.keys(vars), `return !!(${cond});`)(...Object.values(vars)) ? block : ''; }
      catch { return ''; }
    });

    // {{#each array}} ... {{/each}}  — wewnątrz: {{this.prop}} lub {{@index}}
    out = out.replace(/\{\{#each\s+(.+?)\}\}([\s\S]*?)\{\{\/each\}\}/g, (_, arrExpr, block) => {
      try {
        const arr = new Function(...Object.keys(vars), `return ${arrExpr};`)(...Object.values(vars));
        if (!Array.isArray(arr)) return '';
        return arr.map((item, idx) => {
          let b = block;
          b = b.replace(/\{\{@index\}\}/g, idx);
          b = b.replace(/\{\{this\.([^}]+)\}\}/g, (__, k) => item?.[k] ?? '');
          b = b.replace(/\{\{this\}\}/g, item);
          return b;
        }).join('');
      } catch { return ''; }
    });

    // {{variable}} – escape HTML
    out = out.replace(/\{\{([^}]+)\}\}/g, (_, expr) => {
      try {
        const val = new Function(...Object.keys(vars), `return ${expr.trim()};`)(...Object.values(vars));
        return String(val ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      } catch { return ''; }
    });

    return out;
  }

  _renderFile(name, data = {}, res) {
    const filePath = path.join(this._viewsDir, name);
    fs.readFile(filePath, 'utf8', (err, src) => {
      if (err) { res.status(500).send('Template not found: ' + name); return; }

      // Obsługa {{> partial}} (include)
      const includeRegex = /\{\{>\s*(.+?)\s*\}\}/g;
      const loadIncludes = (tpl, cb) => {
        const matches = [...tpl.matchAll(includeRegex)];
        if (!matches.length) return cb(tpl);
        let pending = matches.length;
        matches.forEach(m => {
          const pPath = path.join(this._viewsDir, m[1]);
          fs.readFile(pPath, 'utf8', (e, pSrc) => {
            tpl = tpl.replace(m[0], e ? '' : pSrc);
            if (--pending === 0) cb(tpl);
          });
        });
      };

      loadIncludes(src, tpl => {
        const html = this._render(tpl, data);
        res.type('text/html').send(html);
      });
    });
  }

  // ── Obsługa plików statycznych ──────────────────────────────
  _tryStatic(pathname, res) {
    for (const dir of this._staticDirs) {
      const fp = path.join(dir, path.normalize(pathname));
      if (!fp.startsWith(dir)) continue;
      if (fs.existsSync(fp) && fs.statSync(fp).isFile()) {
        const ext = path.extname(fp).toLowerCase();
        const mime = {
          '.html':'text/html;charset=utf-8', '.css':'text/css;charset=utf-8',
          '.js':'application/javascript;charset=utf-8', '.json':'application/json',
          '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml',
          '.ico':'image/x-icon', '.woff2':'font/woff2', '.ttf':'font/ttf',
        }[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': mime });
        fs.createReadStream(fp).pipe(res._raw);
        return true;
      }
    }
    return false;
  }

  // ── HTTP server ─────────────────────────────────────────────
  listen(port, cb) {
    const server = http.createServer((req, rawRes) => {
      const parsed   = url.parse(req.url, true);
      const pathname = parsed.pathname;

      // Wzbogacony obiekt request
      req.path   = pathname;
      req.query  = parsed.query;
      req.params = {};
      req.body   = null;

      // Wzbogacony obiekt response
      rawRes._raw = rawRes;
      rawRes.status = (code) => { rawRes.statusCode = code; return rawRes; };
      rawRes.type   = (ct)   => { rawRes.setHeader('Content-Type', ct); return rawRes; };
      rawRes.send   = (body) => {
        if (!rawRes.getHeader('Content-Type')) rawRes.setHeader('Content-Type', 'text/plain;charset=utf-8');
        rawRes.end(typeof body === 'object' ? JSON.stringify(body) : String(body));
      };
      rawRes.json   = (obj)  => rawRes.type('application/json').send(obj);
      rawRes.redirect = (loc) => { rawRes.writeHead(302, { Location: loc }); rawRes.end(); };
      rawRes.render  = (name, data) => this._renderFile(name, data, rawRes);

      // Parsowanie body (JSON + urlencoded)
      const parseBody = (next) => {
        let buf = '';
        req.on('data', c => buf += c);
        req.on('end', () => {
          const ct = req.headers['content-type'] || '';
          if (ct.includes('application/json')) {
            try { req.body = JSON.parse(buf); } catch { req.body = {}; }
          } else if (ct.includes('urlencoded')) {
            req.body = Object.fromEntries(new URLSearchParams(buf));
          } else { req.body = buf; }
          next();
        });
      };

      // Uruchom middleware stack
      const allMiddleware = [...this.middlewares];
      const runStack = (stack, i, finalFn) => {
        if (i >= stack.length) { finalFn(); return; }
        stack[i](req, rawRes, () => runStack(stack, i + 1, finalFn));
      };

      parseBody(() => {
        runStack(allMiddleware, 0, () => {
          // Statyczne pliki
          if (req.method === 'GET' && this._tryStatic(pathname, rawRes)) return;

          // Routing
          const match = this.router.match(req.method, pathname);
          if (!match) {
            rawRes.status(404).type('text/html').send(`
              <html><body style="font-family:sans-serif;padding:40px;background:#FFF8EE">
              <h1>404 – Nie znaleziono</h1><p>Ścieżka: <code>${pathname}</code></p>
              <a href="/">← Wróć na stronę główną</a></body></html>`);
            return;
          }

          req.params = match.params;
          runStack(match.handlers, 0, () => {});
        });
      });
    });

    server.listen(port, cb);
    return server;
  }
}

module.exports = () => new MiniExpress();
