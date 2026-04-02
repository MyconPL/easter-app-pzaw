/* ═══════════════════════════════════════════════
   WIELKANOC 2026 – Client JS
═══════════════════════════════════════════════ */

// ── Custom cursor ───────────────────────────────
const cursor = document.getElementById('cursor');
if (cursor) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });
}

// ── Sticky nav scroll ───────────────────────────
const nav = document.getElementById('main-nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ── Active nav link ─────────────────────────────
document.querySelectorAll('.nav-link').forEach(link => {
  if (link.getAttribute('href') === location.pathname) {
    link.classList.add('active');
  }
});

// ── Mobile menu ─────────────────────────────────
const burger = document.getElementById('nav-burger');
const mobileMenu = document.getElementById('mobile-menu');
if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const spans = burger.querySelectorAll('span');
    if (mobileMenu.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => { s.style.transform=''; s.style.opacity=''; });
    }
  });
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });
}

// ── Scroll reveal ───────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.wish-card, .recipe-card, .qnav-card').forEach(el => {
  revealObs.observe(el);
});

// ── Hero bunny click ────────────────────────────
const bunny = document.getElementById('hero-bunny');
if (bunny) {
  let clicks = 0;
  const msgs = ['🥕 Mam marchewkę!','🌸 Wesołej Wielkanocy!','🎵 Hop, hop, hop!','💫 Jestem magicznym zającem!','🥚 Gdzie moje jajka?!'];
  bunny.addEventListener('click', () => {
    clicks++;
    showFloat(bunny, msgs[clicks % msgs.length]);
    bunny.style.transform = 'scale(1.2) rotate(10deg)';
    setTimeout(() => { bunny.style.transform = ''; }, 350);
    if (clicks === 5) spawnHeartsFrom(bunny);
  });
}

// ── Floating text helper ────────────────────────
function showFloat(el, text) {
  const rect = el.getBoundingClientRect();
  const f = document.createElement('div');
  f.textContent = text;
  f.style.cssText = `
    position:fixed;left:${rect.left+rect.width/2}px;top:${rect.top-10}px;
    transform:translate(-50%,0);background:white;padding:8px 18px;border-radius:24px;
    font-size:.92rem;font-weight:600;color:var(--coral,#E8553D);
    box-shadow:0 6px 20px rgba(0,0,0,.12);z-index:9000;pointer-events:none;white-space:nowrap;
    animation:floatUp 1.4s ease forwards;
  `;
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 1500);
}

// ── Hearts burst ────────────────────────────────
function spawnHeartsFrom(el) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top + rect.height/2;
  ['❤️','💕','💖','🌸','✨'].forEach((em, i) => {
    setTimeout(() => {
      const ang = (i/5)*Math.PI*2;
      const d = 80 + Math.random()*40;
      const p = document.createElement('div');
      p.textContent = em;
      p.style.cssText=`position:fixed;left:${cx}px;top:${cy}px;font-size:1.5rem;z-index:9000;pointer-events:none;transition:all 1s ease;opacity:1;transform:translate(0,0)`;
      document.body.appendChild(p);
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        p.style.transform=`translate(${Math.cos(ang)*d}px,${Math.sin(ang)*d-40}px)`;
        p.style.opacity='0';
      }));
      setTimeout(()=>p.remove(),1100);
    }, i*60);
  });
}

// ── Inject keyframes ────────────────────────────
const ks = document.createElement('style');
ks.textContent = `
  @keyframes floatUp {
    0%   { opacity:1; transform:translate(-50%,0); }
    100% { opacity:0; transform:translate(-50%,-70px); }
  }
  @keyframes confFall {
    to { transform:translateY(120vh) rotate(360deg); opacity:0; }
  }
`;
document.head.appendChild(ks);

// ── Konami code easter egg ───────────────────────
let kseq = '';
const kCode = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRight';
document.addEventListener('keydown', e => {
  kseq += e.key;
  if (kseq.length > kCode.length) kseq = kseq.slice(-kCode.length);
  if (kseq === kCode) {
    kseq = '';
    for(let i=0;i<40;i++) setTimeout(()=>{
      const ems=['🐰','🥚','🌸','⭐','🎉','💐'];
      const p=document.createElement('div');
      p.textContent=ems[Math.floor(Math.random()*ems.length)];
      p.style.cssText=`position:fixed;left:${Math.random()*100}vw;top:-40px;font-size:${1.2+Math.random()*2}rem;z-index:9999;pointer-events:none;animation:confFall ${3+Math.random()*3}s linear forwards`;
      document.body.appendChild(p);
      setTimeout(()=>p.remove(),7000);
    }, i*80);
    showFloat(document.body.firstElementChild, '🐰 KONAMI! Wielkanocna magia!');
  }
});
