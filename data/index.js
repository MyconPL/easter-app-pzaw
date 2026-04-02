// ── Wielkanocne przepisy ────────────────────────────────────────
const recipes = [
  {
    id: 'zurek',
    name: 'Żurek Wielkanocny',
    emoji: '🥣',
    category: 'zupa',
    time: '45 min',
    difficulty: 'średni',
    desc: 'Klasyczny żurek z białą kiełbasą i jajkiem – serce wielkanocnego stołu.',
    ingredients: ['1l zakwas żytni','2 białe kiełbasy','4 jajka','200ml śmietana 18%','4 ząbki czosnku','chrzan','majeranek','sól, pieprz'],
    steps: ['Zagotuj zakwas z czosnkiem i majerankiem przez 15 min.','Dodaj śmietanę, dopraw do smaku.','Pokrój gotowaną kiełbasę i dodaj do żurku.','Podawaj z połówkami jajek i tartym chrzanem.'],
    tags: ['tradycja','wielkanoc','polska kuchnia'],
  },
  {
    id: 'babka',
    name: 'Babka Wielkanocna',
    emoji: '🎂',
    category: 'ciasto',
    time: '80 min',
    difficulty: 'łatwy',
    desc: 'Puszysta babka drożdżowa z rodzynkami i lukrem cytrynowym.',
    ingredients: ['500g mąki','6 jajek','200g cukru','150g masła','25g drożdży','100ml mleka','rodzynki','skórka z cytryny'],
    steps: ['Rozpuść drożdże w ciepłym mleku z łyżką cukru.','Utrzyj żółtka z cukrem i masłem.','Połącz z mąką i wyrośniętymi drożdżami.','Dodaj ubite białka i rodzynki.','Piecz 50 min w 175°C.','Polej lukrem cytrynowym.'],
    tags: ['słodkie','drożdżowe','klasyk'],
  },
  {
    id: 'mazurek',
    name: 'Mazurek Kajmakowy',
    emoji: '🍮',
    category: 'ciasto',
    time: '60 min',
    difficulty: 'średni',
    desc: 'Kruche ciasto z masą kajmakową i orzechami – wielkanocny rarytas.',
    ingredients: ['300g mąki','200g masła','100g cukru pudru','3 żółtka','szczypta soli','400g kajmak z puszki','100g orzechów','czekolada do dekoracji'],
    steps: ['Zagnieć kruche ciasto, schłodź 30 min.','Rozwałkuj i piecz 20 min w 180°C.','Posmaruj kajmakiem.','Udekoruj orzechami i polej czekoladą.'],
    tags: ['kruche','kajmak','świąteczne'],
  },
  {
    id: 'jagniecina',
    name: 'Pieczeń Jagnięca',
    emoji: '🍖',
    category: 'danie-glowne',
    time: '180 min',
    difficulty: 'trudny',
    desc: 'Soczysta jagnięcina z rozmarynem i czosnkiem – wielkanocna uczta.',
    ingredients: ['1.5kg udziec jagnięcy','8 ząbków czosnku','3 gałązki rozmarynu','2 cytryny','oliwa z oliwek','sól morska','czarny pieprz','czerwone wino'],
    steps: ['Natrzyj mięso czosnkiem, rozmarynem i solą.','Skrop oliwą i sokiem z cytryny. Marynuj 2h.','Piecz 2.5h w 160°C, polewając winem co 30 min.','Odstaw na 20 min przed krojeniem.'],
    tags: ['mięso','święta','obiad'],
  },
  {
    id: 'pisanki',
    name: 'Domowe Pisanki Naturalne',
    emoji: '🥚',
    category: 'dekoracje',
    time: '30 min',
    difficulty: 'łatwy',
    desc: 'Jajka barwione naturalnymi składnikami – cebula, burak, szpinak.',
    ingredients: ['12 jajek','łuski cebuli (żółty)','burak gotowany (różowy)','sok ze szpinaku (zielony)','kurkuma (pomarańczowy)','ocet biały','woda'],
    steps: ['Ugotuj jajka na twardo.','Przygotuj osobne kąpiele barwnikowe z każdego warzywa.','Dodaj łyżkę octu do każdej kąpieli (utrwala kolor).','Zanurz jajka na 30 min lub dłużej dla głębszego koloru.','Osusz i natrzyj olejem dla połysku.'],
    tags: ['naturalny','eko','rękodzieło'],
  },
  {
    id: 'pasztet',
    name: 'Wielkanocny Pasztet',
    emoji: '🥧',
    category: 'przekaska',
    time: '120 min',
    difficulty: 'średni',
    desc: 'Domowy pasztet z drobiu z suszonymi śliwkami i żurawiną.',
    ingredients: ['800g udka z kurczaka','300g wątróbki drobiowej','2 cebule','3 jajka','100g bułki tartej','suszone śliwki','żurawina','gałka muszkatołowa','majeranek'],
    steps: ['Ugotuj mięso z cebulą do miękkości.','Zmiel mięso z wątróbką dwukrotnie.','Dodaj jajka, bułkę tartą i przyprawy.','Przełóż do formy, dekoruj śliwkami.','Piecz 75 min w 175°C w kąpieli wodnej.'],
    tags: ['mięsny','tradycja','przekąska'],
  },
];

// ── Jajka (polowanie) ───────────────────────────────────────────
const eggs = [
  { id:1, name:'Koralowe', color:'#FF6B6B', pattern:'zigzag',    points:10,  rarity:'common',    emoji:'🔴', surprise:'Wiosna przynosi radość! 🌸' },
  { id:2, name:'Niebieskie', color:'#4D96FF', pattern:'dots',    points:15,  rarity:'common',    emoji:'💙', surprise:'Spokój błękitu nieba ☁️' },
  { id:3, name:'Szmaragdowe', color:'#6BCB77', pattern:'stripes', points:20, rarity:'common',    emoji:'💚', surprise:'Zieleń nowej nadziei 🌿' },
  { id:4, name:'Złote', color:'#FFD93D', pattern:'diamonds',     points:25,  rarity:'uncommon',  emoji:'💛', surprise:'Złoto wiosennego słońca ☀️' },
  { id:5, name:'Koralowe II', color:'#FF8C42', pattern:'waves',  points:30,  rarity:'uncommon',  emoji:'🧡', surprise:'Ciepło jesiennego ognia 🔥' },
  { id:6, name:'Lawendowe', color:'#C9B8E8', pattern:'flowers',  points:35,  rarity:'uncommon',  emoji:'💜', surprise:'Aromat lawendowej łąki 💐' },
  { id:7, name:'Różane', color:'#FF4D7D', pattern:'hearts',      points:40,  rarity:'rare',      emoji:'❤️', surprise:'Miłość w każdym płatku 🌹' },
  { id:8, name:'Morskie', color:'#00C9A7', pattern:'waves',      points:45,  rarity:'rare',      emoji:'🩵', surprise:'Głębia morskich tajemnic 🌊' },
  { id:9, name:'Złote Rzadkie', color:'#FFD700', pattern:'stars', points:60, rarity:'epic',      emoji:'🌟', surprise:'Legendarny skarb Wielkanocny! ✨' },
  { id:10, name:'Srebrne', color:'#C0C0C0', pattern:'geometric', points:70,  rarity:'epic',      emoji:'🥈', surprise:'Srebrna magia! Niesamowite znalezisko 🪄' },
  { id:11, name:'Tęczowe', color:'rainbow',  pattern:'rainbow',  points:80,  rarity:'legendary', emoji:'🌈', surprise:'Magia tęczy! Jedno na milion! 🦄' },
  { id:12, name:'Diamentowe', color:'#B9F2FF', pattern:'crystal', points:100, rarity:'legendary', emoji:'💎', surprise:'LEGENDARNY SKARB! Diamentowe Jajko! 👑' },
];

// ── Życzenia ─────────────────────────────────────────────────────
const wishes = [
  { icon:'🌸', title:'Radości i Szczęścia',    text:'Niech każdy wielkanocny poranek wypełni Twój dom śmiechem, ciepłem i miłością bliskich.' },
  { icon:'🌿', title:'Zdrowia i Sił',           text:'Świeżość wiosennego poranka niech towarzyszy Ci przez cały rok, dodając energii każdego dnia.' },
  { icon:'🐣', title:'Nowych Początków',        text:'Wielkanoc to czas odrodzenia. Niech każdy świt przyniesie nowe możliwości i spełnienie marzeń.' },
  { icon:'🌷', title:'Miłości i Rodziny',       text:'Niech świąteczny stół będzie pełen serdecznych uśmiechów i chwil, które zapamiętasz na zawsze.' },
  { icon:'🕊️', title:'Spokoju i Harmonii',      text:'Niech wielkanocny spokój zagości w Twoim sercu i pozostanie tam przez cały nadchodzący rok.' },
  { icon:'🌺', title:'Spełnienia Marzeń',       text:'Jak pisanka kryje w sobie niespodzianki, tak niech każdy dzień przynosi Ci piękne zaskoczenia.' },
];

// ── Quiz pytania ──────────────────────────────────────────────────
const quizQuestions = [
  {
    q: 'Ile dni trwa Triduum Paschalne?',
    answers: ['2 dni','3 dni','7 dni','40 dni'],
    correct: 1,
    fun: 'Triduum Paschalne (Wielki Czwartek, Piątek i Sobota) to trzy dni przygotowań przed Wielkanocą.',
  },
  {
    q: 'Skąd pochodzi tradycja malowania pisanek?',
    answers: ['Starożytny Egipt','Słowiańskie obrzędy','Rzym starożytny','Tradycja grecka'],
    correct: 1,
    fun: 'Pisanki mają korzenie w słowiańskich wiosennych obrzędach płodności, długo przed chrześcijaństwem.',
  },
  {
    q: 'Jak nazywa się zupa typowa dla polskiej Wielkanocy?',
    answers: ['Barszcz','Rosół','Żurek','Grochówka'],
    correct: 2,
    fun: 'Żurek to zakwas żytni z jajkami i białą kiełbasą – absolutna klasyka wielkanocnego śniadania!',
  },
  {
    q: 'Co symbolizuje baranek wielkanocny?',
    answers: ['Wiosnę i odrodzenie','Jezusa Chrystusa','Dostatek i bogactwo','Rodzinę i miłość'],
    correct: 1,
    fun: 'Baranek (Agnus Dei) to jeden z najważniejszych symboli chrześcijańskich – symbol Chrystusa.',
  },
  {
    q: 'Ile kalorii ma tradycyjne wielkanocne śniadanie?',
    answers: ['~500 kcal','~800 kcal','~1200 kcal','~2000 kcal'],
    correct: 2,
    fun: 'Pełne wielkanocne śniadanie z żurkiem, jajkami, kiełbasą i ciastem to zazwyczaj ok. 1200 kcal!',
  },
];

module.exports = { recipes, eggs, wishes, quizQuestions };
