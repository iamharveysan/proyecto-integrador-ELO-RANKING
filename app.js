document.addEventListener("DOMContentLoaded", () => {

  // ══════════════════════════════════════════════════════
  // CONFIG
  // ══════════════════════════════════════════════════════
  const BACKEND_URL     = "https://script.google.com/macros/s/AKfycbxapJkaEfyDG7V5gVlJKxLtVXm6NjBj4jRaS_l70VDYRfjBB6X2tPvuq-IW8cjORsMG_Q/exec";
  const LOCAL_STATE_KEY = "usb_elo_pro_v3";
  const SESSION_KEY     = "usb_elo_session_v3";
  const VISIT_FLAG      = "usb_elo_visit_v3";
  const RATING_INICIAL  = 1000;
  const K               = 32;

  // ══════════════════════════════════════════════════════
  // TEMAS
  // ══════════════════════════════════════════════════════
  const THEME_META = {
    admin:       { nombre: "Administración de Empresas",     sigla: "ADM", cls: "t-admin",       dot: "dot-admin"       },
    psico:       { nombre: "Psicología",                     sigla: "PSI", cls: "t-psico",       dot: "dot-psico"       },
    cideh:       { nombre: "CIDEH",                          sigla: "CID", cls: "t-cideh",       dot: "dot-cideh"       },
    ingenieria:  { nombre: "Ingeniería",                     sigla: "ING", cls: "t-ingenieria",  dot: "dot-ingenieria"  },
    juridicas:   { nombre: "Ciencias Jurídicas y Políticas", sigla: "CJP", cls: "t-juridicas",   dot: "dot-juridicas"   },
    humanidades: { nombre: "Humanidades",                    sigla: "HUM", cls: "t-humanidades", dot: "dot-humanidades" },
  };

  // ══════════════════════════════════════════════════════
  // ELECTIVAS
  // ══════════════════════════════════════════════════════
  const cursos = [
    { id:"marketing-internacional",       nombre:"Marketing Internacional",                              facultad:"Administración de Empresas", programa:"Adm. de Empresas",       tema:"admin"       },
    { id:"fundamentos-mercadeo",          nombre:"Fundamentos de Mercadeo",                              facultad:"Administración de Empresas", programa:"Adm. de Empresas",       tema:"admin"       },
    { id:"ecommerce",                     nombre:"E-commerce",                                           facultad:"Administración de Empresas", programa:"Adm. de Empresas",       tema:"admin"       },
    { id:"intervencion-motivacional",     nombre:"Intervención Motivacional",                            facultad:"Psicología",                 programa:"Psicología",             tema:"psico"       },
    { id:"contextos-violencia",           nombre:"Contextos de Violencia",                               facultad:"Psicología",                 programa:"Psicología",             tema:"psico"       },
    { id:"pruebas-psicologicas",          nombre:"Pruebas Psicológicas",                                 facultad:"Psicología",                 programa:"Psicología",             tema:"psico"       },
    { id:"acoso-laboral",                 nombre:"Acoso Laboral",                                        facultad:"Psicología",                 programa:"Psicología",             tema:"psico"       },
    { id:"tendencias-orientacion",        nombre:"Tendencias Contemporáneas en Orientación Escolar",     facultad:"Psicología",                 programa:"Psicología",             tema:"psico"       },
    { id:"evaluacion-ninos-adolescentes", nombre:"Evaluación e Intervención en Niños y Adolescentes",   facultad:"Psicología",                 programa:"Psicología",             tema:"psico"       },
    { id:"constitucion-derecho",          nombre:"Constitución, Derecho y Democracia",                   facultad:"CIDEH",                      programa:"Abierta para todos",     tema:"cideh"       },
    { id:"cultura-ecologica",             nombre:"Cultura Ecológica",                                    facultad:"CIDEH",                      programa:"Abierta para todos",     tema:"cideh"       },
    { id:"proyecto-vida",                 nombre:"Proyecto de Vida",                                     facultad:"CIDEH",                      programa:"Abierta para todos",     tema:"cideh"       },
    { id:"catedra-paz",                   nombre:"Cátedra para la Paz",                                  facultad:"CIDEH",                      programa:"Abierta para todos",     tema:"cideh"       },
    { id:"arte-comunicacion",             nombre:"Arte y Comunicación",                                  facultad:"CIDEH",                      programa:"Abierta para todos",     tema:"cideh"       },
    { id:"desarrollo-aplicaciones",       nombre:"Desarrollo de Aplicaciones",                           facultad:"Ingeniería",                 programa:"Ing. de Sistemas",       tema:"ingenieria"  },
    { id:"realidades-mixtas",             nombre:"Realidades Mixtas",                                    facultad:"Ingeniería",                 programa:"Ing. Multimedia",        tema:"ingenieria"  },
    { id:"desarrollo-videojuegos",        nombre:"Desarrollo de Videojuegos",                            facultad:"Ingeniería",                 programa:"Ing. Multimedia",        tema:"ingenieria"  },
    { id:"aeronaves-no-tripuladas",       nombre:"Diseño de Aeronaves no Tripuladas - UAS",              facultad:"Ingeniería",                 programa:"Ing. Aeronáutica",       tema:"ingenieria"  },
    { id:"audio-inmersivo",               nombre:"Sonido y Audio Inmersivo",                             facultad:"Ingeniería",                 programa:"Ing. de Sonido",         tema:"ingenieria"  },
    { id:"migracion-desplazamiento",      nombre:"Migración y Desplazamiento",                           facultad:"Ciencias Jurídicas y Políticas", programa:"Ciencia Política",   tema:"juridicas"   },
    { id:"opinion-publica-elecciones",    nombre:"Opinión Pública y Elecciones",                         facultad:"Ciencias Jurídicas y Políticas", programa:"Ciencia Política",   tema:"juridicas"   },
    { id:"terrorismo-internacional",      nombre:"Terrorismo Internacional",                              facultad:"Ciencias Jurídicas y Políticas", programa:"Relaciones Internac.", tema:"juridicas" },
    { id:"videojuegos-paginas-web",       nombre:"Videojuegos y Páginas Web",                            facultad:"Humanidades",                programa:"Profesional Lengua Inglesa", tema:"humanidades" },
    { id:"teologia-contemporanea",        nombre:"Teología Contemporánea",                               facultad:"Humanidades",                programa:"Teología",               tema:"humanidades" },
  ];

  const cursoPorNombre = Object.fromEntries(cursos.map(c => [c.nombre, c]));

  // ── Perfiles: semestres USB + públicos externos ──────────
  const segmentos = {
    // Estudiantes USB por semestre
    S1:  "1er semestre",
    S2:  "2do semestre",
    S3:  "3er semestre",
    S4:  "4to semestre",
    S5:  "5to semestre",
    S6:  "6to semestre",
    S7:  "7mo semestre",
    S8:  "8vo semestre",
    S9:  "9no semestre",
    S10: "10mo semestre",
    // Perfiles por interés
    INT_TEC:  "Interés: Tecnología / Innovación",
    INT_DAT:  "Interés: Datos / Analítica",
    INT_CRE:  "Interés: Creatividad / Diseño / Arte",
    INT_NEG:  "Interés: Negocios / Emprendimiento",
    INT_SOC:  "Interés: Social / Comunitario",
    INT_JUR:  "Interés: Derecho / Política / RRII",
    INT_PSI:  "Interés: Salud Mental / Bienestar",
    // Públicos externos
    EXT_EST:  "Externo: Estudiante de otra universidad",
    EXT_PROF: "Externo: Profesional en ejercicio",
    EXT_EMP:  "Externo: Emprendedor",
    EXT_DOC:  "Externo: Docente / Investigador",
    EXT_GEN:  "Externo: Público general",
  };

  // ── Contextos de decisión ────────────────────────────────
  const contextos = {
    // Orientación laboral
    EMP: "¿Cuál electiva mejora más tu empleabilidad?",
    EMP2:"¿Cuál aporta más habilidades para el mercado laboral?",
    // Aprendizaje
    FUN: "¿Cuál electiva es mejor para aprender fundamentos sólidos?",
    PRAC:"¿Cuál tiene mayor aplicación práctica en el mundo real?",
    // Proyecto personal
    VID: "¿Cuál electiva se conecta más con tu proyecto de vida?",
    PAZ: "¿Cuál electiva contribuye más a la paz y la convivencia?",
    // Externo / exploración
    EXP: "Si eres externo a USB, ¿cuál electiva tomarías primero?",
    REC: "¿Cuál electiva recomendarías a un amigo que no estudia en USB?",
    // Curiosidad académica
    INV: "¿Cuál electiva tiene mayor potencial para investigación?",
    CUR: "¿Cuál electiva despierta más curiosidad o interés general?",
  };

  // ══════════════════════════════════════════════════════
  // DOM
  // ══════════════════════════════════════════════════════
  const segmentSelect = document.getElementById("segmentSelect");
  const contextSelect = document.getElementById("contextSelect");
  const facultySelect = document.getElementById("facultySelect");
  const searchInput   = document.getElementById("searchInput");

  const usageCountEl   = document.getElementById("usageCount");
  const globalDuelEl   = document.getElementById("globalDuelCount");
  const filteredEl     = document.getElementById("filteredCount");
  const rankingTitleEl = document.getElementById("rankingTitle");

  const heroTitle   = document.getElementById("heroTitle");
  const heroBadge   = document.getElementById("heroBadge");
  const heroProgram = document.getElementById("heroProgram");
  const heroBg      = document.getElementById("heroBg");

  const duelModal    = document.getElementById("duelModal");
  const modalClose   = document.getElementById("modalClose");
  const modalQuestion = document.getElementById("modalQuestion");
  const btnA         = document.getElementById("btnA");
  const btnB         = document.getElementById("btnB");
  const duelAContent = document.getElementById("duelAContent");
  const duelBContent = document.getElementById("duelBContent");
  const btnNewPair   = document.getElementById("btnNewPair");

  const btnOpenDuel = document.getElementById("btnOpenDuel");
  const btnRefresh  = document.getElementById("btnRefresh");
  const btnClear    = document.getElementById("btnClear");

  const topBox      = document.getElementById("topBox");
  const facultyRows = document.getElementById("facultyRows");
  const recentVotes = document.getElementById("recentVotes");
  const toastEl     = document.getElementById("toast");
  const mainNav     = document.getElementById("mainNav");

  // ══════════════════════════════════════════════════════
  // STATE
  // ══════════════════════════════════════════════════════
  let currentA = null, currentB = null;
  let serverVotes = [];
  let serverStats = { visitas: 0, duelos: 0 };
  let buckets = {};
  let usingBackend = false;

  // ══════════════════════════════════════════════════════
  // UTILS
  // ══════════════════════════════════════════════════════
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toastEl.classList.remove("show"), 2600);
  }

  function fillSegmentSelect() {
    segmentSelect.innerHTML = `
      <option value="GLOBAL">🌐 Ranking global — todos los votos</option>
      <optgroup label="Inicio de carrera (1–3)">
        <option value="S1">1er semestre</option>
        <option value="S2">2do semestre</option>
        <option value="S3">3er semestre</option>
      </optgroup>
      <optgroup label="Mitad de carrera (4–7)">
        <option value="S4">4to semestre</option>
        <option value="S5">5to semestre</option>
        <option value="S6">6to semestre</option>
        <option value="S7">7mo semestre</option>
      </optgroup>
      <optgroup label="Cierre de carrera (8–10)">
        <option value="S8">8vo semestre</option>
        <option value="S9">9no semestre</option>
        <option value="S10">10mo semestre</option>
      </optgroup>
      <optgroup label="Por interés">
        <option value="INT_TEC">Tecnología / Innovación</option>
        <option value="INT_DAT">Datos / Analítica</option>
        <option value="INT_CRE">Creatividad / Diseño / Arte</option>
        <option value="INT_NEG">Negocios / Emprendimiento</option>
        <option value="INT_SOC">Social / Comunitario</option>
        <option value="INT_JUR">Derecho / Política / RRII</option>
        <option value="INT_PSI">Salud Mental / Bienestar</option>
      </optgroup>
      <optgroup label="Públicos externos">
        <option value="EXT_EST">Estudiante de otra universidad</option>
        <option value="EXT_PROF">Profesional en ejercicio</option>
        <option value="EXT_EMP">Emprendedor</option>
        <option value="EXT_DOC">Docente / Investigador</option>
        <option value="EXT_GEN">Público general</option>
      </optgroup>`;
  }

  function fillContextSelect() {
    contextSelect.innerHTML = `
      <optgroup label="Empleabilidad">
        <option value="EMP">¿Cuál mejora más tu empleabilidad?</option>
        <option value="EMP2">¿Cuál da más habilidades para el mercado?</option>
      </optgroup>
      <optgroup label="Aprendizaje">
        <option value="FUN">¿Cuál es mejor para fundamentos sólidos?</option>
        <option value="PRAC">¿Cuál tiene más aplicación práctica?</option>
      </optgroup>
      <optgroup label="Proyecto personal">
        <option value="VID">¿Cuál se conecta más con tu proyecto de vida?</option>
        <option value="PAZ">¿Cuál contribuye más a la paz y convivencia?</option>
      </optgroup>
      <optgroup label="Perspectiva externa">
        <option value="EXP">Si eres externo a USB, ¿cuál tomarías primero?</option>
        <option value="REC">¿Cuál recomendarías a alguien fuera de USB?</option>
      </optgroup>
      <optgroup label="Curiosidad académica">
        <option value="INV">¿Cuál tiene mayor potencial de investigación?</option>
        <option value="CUR">¿Cuál despierta más curiosidad en general?</option>
      </optgroup>`;
  }

  function fillFacultySelect() {
    facultySelect.innerHTML = `<option value="all">Todas las facultades</option>`;
    Object.entries(THEME_META).forEach(([k, m]) => {
      const o = document.createElement("option");
      o.value = k; o.textContent = m.nombre;
      facultySelect.appendChild(o);
    });
  }

  // Kept for generic use (recent votes filter, etc.)
  function fillSelect(el, obj) {
    el.innerHTML = "";
    Object.entries(obj).forEach(([k, v]) => {
      const o = document.createElement("option");
      o.value = k; o.textContent = v;
      el.appendChild(o);
    });
  }

  function getSessionId() {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `s_${Date.now()}_${Math.random().toString(36).slice(2,9)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  }

  function fmt(n) { return new Intl.NumberFormat("es-CO").format(n || 0); }

  function normalize(s) {
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  }

  function monogram(name) {
    const stop = new Set(["de","y","la","el","en","para","del","las","los","no","e","un","una"]);
    return normalize(name).split(/[\s\-\/]+/).filter(Boolean)
      .filter(w => !stop.has(w)).slice(0,3).map(w => w[0].toUpperCase()).join("");
  }

  function bucketKey(s, c) { return `${s}__${c}`; }
  function isGlobalMode() {
    return segmentSelect.value === "GLOBAL" || contextSelect.value === "GLOBAL";
  }

  function curBucket() {
    if (isGlobalMode()) return buckets["GLOBAL__GLOBAL"];
    return buckets[bucketKey(segmentSelect.value, contextSelect.value)];
  }

  function courseMatchesFilters(cu) {
    const fv = facultySelect.value;
    const q  = normalize(searchInput.value.trim());
    const facOk = fv === "all" || cu.tema === fv;
    const qOk   = !q || normalize(`${cu.nombre} ${cu.programa} ${cu.facultad}`).includes(q);
    return facOk && qOk;
  }

  function getDisplayCourses() { return cursos.filter(courseMatchesFilters); }

  function getSortedDisplay() {
    const b = curBucket();
    const allowed = new Set(getDisplayCourses().map(c => c.id));
    if (!b) return [];
    return cursos.map(c => ({
      ...c,
      rating: b[c.nombre].rating,
      wins:   b[c.nombre].wins,
      duels:  b[c.nombre].duels,
    })).filter(c => allowed.has(c.id)).sort((a,z) => z.rating - a.rating);
  }

  function countFiltered() {
    if (isGlobalMode()) return serverVotes.length;
    const fv = facultySelect.value;
    const q  = normalize(searchInput.value.trim());
    return serverVotes.filter(v => {
      if (v.segmentKey !== segmentSelect.value || v.contextKey !== contextSelect.value) return false;
      const cu = cursoPorNombre[v.winner];
      if (!cu) return false;
      if (fv !== "all" && cu.tema !== fv) return false;
      if (!q) return true;
      return normalize(`${v.winner} ${v.loser}`).includes(q);
    }).length;
  }

  function getDuelPool() {
    const d = getDisplayCourses();
    if (d.length >= 2) return d;
    const fv = facultySelect.value;
    if (fv !== "all") {
      const fp = cursos.filter(c => c.tema === fv);
      if (fp.length >= 2) return fp;
    }
    return cursos;
  }

  // ══════════════════════════════════════════════════════
  // ELO
  // ══════════════════════════════════════════════════════
  function expected(ra, rb) { return 1 / (1 + Math.pow(10, (rb - ra) / 400)); }

  function createEmptyBuckets() {
    const r = {};
    Object.keys(segmentos).forEach(s =>
      Object.keys(contextos).forEach(c => {
        const k = bucketKey(s, c);
        r[k] = {};
        cursos.forEach(cu => { r[k][cu.nombre] = { rating: RATING_INICIAL, wins: 0, duels: 0 }; });
      })
    );
    // Bucket especial GLOBAL — acumula TODOS los votos sin filtro
    r["GLOBAL__GLOBAL"] = {};
    cursos.forEach(cu => { r["GLOBAL__GLOBAL"][cu.nombre] = { rating: RATING_INICIAL, wins: 0, duels: 0 }; });
    return r;
  }

  function applyElo(bucket, nA, nB, winner) {
    const a = bucket[nA], b = bucket[nB];
    const ea = expected(a.rating, b.rating);
    const sa = winner === nA ? 1 : 0;
    a.rating += K * (sa - ea);
    b.rating += K * ((1 - sa) - (1 - ea));
    a.duels++; b.duels++;
    if (sa) a.wins++; else b.wins++;
  }

  function rebuildFromVotes(votes) {
    buckets = createEmptyBuckets();
    votes.forEach(v => {
      // Bucket por filtro
      const k = bucketKey(v.segmentKey, v.contextKey);
      if (buckets[k]?.[v.optionA] && buckets[k]?.[v.optionB]) {
        applyElo(buckets[k], v.optionA, v.optionB, v.winner);
      }
      // Bucket global — siempre
      const g = buckets["GLOBAL__GLOBAL"];
      if (g?.[v.optionA] && g?.[v.optionB]) {
        applyElo(g, v.optionA, v.optionB, v.winner);
      }
    });
  }

  function pickPair() {
    const pool   = getDuelPool();
    const bucket = curBucket();
    if (!bucket || pool.length < 2) return [cursos[0], cursos[1]];

    const ordered = pool.map(c => ({ ...c, exposure: bucket[c.nombre].duels }))
      .sort((a,z) => a.exposure - z.exposure || Math.random() - .5);

    const poolA  = ordered.slice(0, Math.min(6, ordered.length));
    const first  = poolA[Math.floor(Math.random() * poolA.length)];
    const rest   = ordered.filter(x => x.id !== first.id);
    const minE   = Math.min(...rest.map(x => x.exposure));
    const pool2  = rest.filter(x => x.exposure <= minE + 1);
    const second = (pool2.length ? pool2 : rest)[Math.floor(Math.random() * (pool2.length || rest.length))];
    return [first, second];
  }

  // ══════════════════════════════════════════════════════
  // LOCAL PERSISTENCE
  // ══════════════════════════════════════════════════════
  function loadLocal() {
    try { return JSON.parse(localStorage.getItem(LOCAL_STATE_KEY)) || { visitas: 0, votes: [] }; }
    catch { return { visitas: 0, votes: [] }; }
  }
  function saveLocal(s) { localStorage.setItem(LOCAL_STATE_KEY, JSON.stringify(s)); }

  function registerVisitLocal() {
    if (sessionStorage.getItem(VISIT_FLAG) === "1") {
      serverStats.visitas = loadLocal().visitas; return;
    }
    const s = loadLocal();
    s.visitas++;
    saveLocal(s);
    sessionStorage.setItem(VISIT_FLAG, "1");
    serverStats.visitas = s.visitas;
  }

  function bootstrapLocal() {
    const s = loadLocal();
    serverVotes = s.votes;
    serverStats = { visitas: s.visitas, duelos: s.votes.length };
    rebuildFromVotes(serverVotes);
  }

  function persistLocalVote(r) { const s = loadLocal(); s.votes.push(r); saveLocal(s); }

  // ══════════════════════════════════════════════════════
  // BACKEND
  // ══════════════════════════════════════════════════════
  async function callBackend(p = {}) {
    const url = new URL(BACKEND_URL);
    Object.entries(p).forEach(([k, v]) => url.searchParams.set(k, v));
    url.searchParams.set("_ts", Date.now());
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("backend error");
    return res.json();
  }

  async function registerBackendVisitOnce() {
    if (sessionStorage.getItem(VISIT_FLAG) === "1") return;
    await callBackend({ action: "visit", sessionId: getSessionId() });
    sessionStorage.setItem(VISIT_FLAG, "1");
  }

  async function loadBackendBootstrap() {
    const data = await callBackend({ action: "bootstrap" });
    serverStats = { visitas: Number(data.visitas||0), duelos: Number(data.duelos||0) };
    serverVotes = Array.isArray(data.votes) ? data.votes : [];
    rebuildFromVotes(serverVotes);
    usingBackend = true;
  }

  async function sendVoteToBackend(r) {
    await callBackend({ action:"vote", ...r });
  }

  // ══════════════════════════════════════════════════════
  // RENDER — POSTER INNER HTML
  // ══════════════════════════════════════════════════════
  function posterInnerHTML(cu) {
    const th = THEME_META[cu.tema];
    const mo = monogram(cu.nombre);
    return `
      <div class="poster-bg ${th.cls}"></div>
      <div class="poster-overlay"></div>
      <div class="poster-mono">${mo}</div>
      <div class="poster-info">
        <div class="poster-prog">${cu.programa}</div>
        <div class="poster-name">${cu.nombre}</div>
        <span class="poster-fac">${cu.facultad}</span>
      </div>`;
  }

  // ══════════════════════════════════════════════════════
  // RENDER — HERO
  // ══════════════════════════════════════════════════════
  function hasVotes() {
    if (isGlobalMode()) return serverVotes.length > 0;
    return serverVotes.some(v =>
      v.segmentKey === segmentSelect.value &&
      v.contextKey === contextSelect.value
    );
  }

  function renderHero() {
    const sorted = getSortedDisplay();
    const top    = sorted[0];

    if (!top) {
      heroBg.className        = "hero-bg t-cideh";
      heroTitle.textContent   = "¿Cuál electiva lidera?";
      heroProgram.textContent = "Vota tu primer duelo para construir el ranking";
      heroBadge.textContent   = "⚡ Sin votos aún";
      return;
    }

    const th = THEME_META[top.tema];
    heroBg.className = `hero-bg ${th.cls}`;

    if (!hasVotes()) {
      heroTitle.textContent   = "¿Cuál electiva lidera?";
      heroProgram.textContent = "Vota tu primer duelo y construye el ranking con tu opinión";
      heroBadge.textContent   = "⚡ Empieza aquí";
    } else if (isGlobalMode()) {
      heroTitle.textContent   = top.nombre;
      heroProgram.textContent = `${top.programa} · ${top.facultad}`;
      heroBadge.textContent   = `🌐 #1 Global — ${serverVotes.length} votos totales`;
    } else {
      heroTitle.textContent   = top.nombre;
      heroProgram.textContent = `${top.programa} · ${top.facultad}`;
      heroBadge.textContent   = `🏆 #1 en este filtro`;
    }
  }

  // ══════════════════════════════════════════════════════
  // RENDER — TOP RAIL
  // ══════════════════════════════════════════════════════
  function renderTop() {
    const rows = getSortedDisplay();
    const seg  = isGlobalMode()
      ? "Ranking Global"
      : (segmentos[segmentSelect.value] || segmentSelect.value);
    const ctx  = isGlobalMode()
      ? "Todos los perfiles y contextos"
      : (contextos[contextSelect.value] || contextSelect.value);
    rankingTitleEl.textContent = `${seg} · ${ctx}`;

    if (!rows.length) {
      topBox.innerHTML = `
        <div class="empty-cta">
          <p class="empty-cta-title">No hay electivas para este filtro</p>
          <p class="empty-cta-sub">Intenta con otra facultad o borra el buscador</p>
        </div>`;
      return;
    }

    // If nobody has voted yet, show onboarding CTA instead of 24 cards all at 1000 pts
    if (!hasVotes()) {
      topBox.innerHTML = `
        <div class="empty-cta">
          <p class="empty-cta-title">El ranking se construye con tus votos</p>
          <p class="empty-cta-sub">Cada duelo ajusta los puntajes en tiempo real usando el algoritmo ELO</p>
          <button class="empty-cta-btn" onclick="document.getElementById('btnOpenDuel').click()">
            ⚡ Votar en mi primer duelo
          </button>
        </div>`;
      return;
    }

    topBox.innerHTML = rows.map((cu, i) => `
      <div class="rank-card">
        <div class="rank-num-big">${i + 1}</div>
        <div class="rank-card-inner">
          ${posterInnerHTML(cu)}
        </div>
        <div class="rank-card-info">
          <div class="rank-card-name">${cu.nombre}</div>
          <div class="rank-card-score">${cu.rating.toFixed(1)} pts</div>
        </div>
        <div class="rank-tooltip">
          <h4>${cu.nombre}</h4>
          <p>${cu.facultad}</p>
          <div class="rank-tooltip-row"><span>Rating</span><b>${cu.rating.toFixed(1)}</b></div>
          <div class="rank-tooltip-row"><span>Victorias</span><b>${cu.wins}</b></div>
          <div class="rank-tooltip-row"><span>Duelos</span><b>${cu.duels}</b></div>
        </div>
      </div>`).join("");
  }

  // ══════════════════════════════════════════════════════
  // RENDER — FACULTY ROWS
  // ══════════════════════════════════════════════════════
  function renderFacultyRows() {
    facultyRows.innerHTML = "";
    const b = curBucket();
    if (!b) return;

    const temas = facultySelect.value === "all"
      ? Object.keys(THEME_META)
      : [facultySelect.value];

    temas.forEach(tema => {
      const th = THEME_META[tema];
      const tCourses = cursos
        .filter(c => c.tema === tema && courseMatchesFilters(c))
        .map(c => ({ ...c, rating: b[c.nombre].rating, wins: b[c.nombre].wins, duels: b[c.nombre].duels }))
        .sort((a,z) => z.rating - a.rating);

      if (!tCourses.length) return;

      const sec = document.createElement("div");
      sec.className = "fac-row";
      sec.innerHTML = `
        <div class="fac-row-head">
          <div class="fac-dot ${th.dot}"></div>
          <h2 class="fac-title">${th.nombre}</h2>
        </div>
        <div class="poster-rail">
          ${tCourses.map(cu => `
            <div class="rank-card">
              <div class="rank-card-inner">${posterInnerHTML(cu)}</div>
              <div class="rank-card-info">
                <div class="rank-card-name">${cu.nombre}</div>
                <div class="rank-card-score">${cu.rating.toFixed(1)} pts</div>
              </div>
              <div class="rank-tooltip">
                <h4>${cu.nombre}</h4>
                <p>${cu.programa}</p>
                <div class="rank-tooltip-row"><span>Rating</span><b>${cu.rating.toFixed(1)}</b></div>
                <div class="rank-tooltip-row"><span>Victorias</span><b>${cu.wins}</b></div>
                <div class="rank-tooltip-row"><span>Duelos</span><b>${cu.duels}</b></div>
              </div>
            </div>`).join("")}
        </div>`;
      facultyRows.appendChild(sec);
    });
  }

  // ══════════════════════════════════════════════════════
  // RENDER — RECENT VOTES
  // ══════════════════════════════════════════════════════
  function renderRecent() {
    const fv = facultySelect.value;
    const q  = normalize(searchInput.value.trim());

    const list = [...serverVotes].reverse().filter(v => {
      if (v.segmentKey !== segmentSelect.value || v.contextKey !== contextSelect.value) return false;
      const cu = cursoPorNombre[v.winner];
      if (!cu) return false;
      if (fv !== "all" && cu.tema !== fv) return false;
      if (!q) return true;
      return normalize(`${v.winner} ${v.loser}`).includes(q);
    }).slice(0, 8);

    if (!list.length) {
      recentVotes.innerHTML = `
        <div class="empty-cta empty-cta--sm">
          <p class="empty-cta-title">Aquí aparecerán los duelos recientes</p>
          <p class="empty-cta-sub">Cada voto queda registrado con el perfil y el contexto seleccionado</p>
        </div>`;
      return;
    }

    recentVotes.innerHTML = list.map(v => `
      <div class="recent-item">
        <div class="recent-winner">${v.winner}</div>
        <div class="recent-loser">vs. ${v.loser}</div>
        <div class="recent-meta">${segmentos[v.segmentKey] || v.segmentKey} · ${contextos[v.contextKey] || v.contextKey}</div>
      </div>`).join("");
  }

  // ══════════════════════════════════════════════════════
  // RENDER — COUNTERS
  // ══════════════════════════════════════════════════════
  function renderCounters() {
    usageCountEl.textContent  = fmt(serverStats.visitas);
    globalDuelEl.textContent  = fmt(serverStats.duelos);
    filteredEl.textContent    = fmt(countFiltered());
  }

  // ══════════════════════════════════════════════════════
  // RENDER — DUEL (inside modal)
  // ══════════════════════════════════════════════════════
  function renderDuel() {
    const [a, b] = pickPair();
    currentA = a; currentB = b;

    modalQuestion.textContent = contextos[contextSelect.value] || "¿Cuál prefieres?";

    // Inject poster HTML directly into the .duel-poster divs
    duelAContent.innerHTML = posterInnerHTML(a);
    duelBContent.innerHTML = posterInnerHTML(b);
  }

  // ══════════════════════════════════════════════════════
  // RENDER ALL
  // ══════════════════════════════════════════════════════
  function renderAll() {
    renderHero();
    renderTop();
    renderFacultyRows();
    renderRecent();
    renderCounters();
  }

  // ══════════════════════════════════════════════════════
  // MODAL
  // ══════════════════════════════════════════════════════
  function openModal() {
    renderDuel();
    duelModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    duelModal.classList.remove("open");
    document.body.style.overflow = "";
  }

  // ══════════════════════════════════════════════════════
  // VOTE
  // ══════════════════════════════════════════════════════
  async function vote(side) {
    if (!currentA || !currentB) return;
    const winner = side === "A" ? currentA : currentB;
    const loser  = side === "A" ? currentB : currentA;

    const rec = {
      ts:           new Date().toISOString(),
      sessionId:    getSessionId(),
      segmentKey:   segmentSelect.value,
      segmentLabel: segmentos[segmentSelect.value],
      contextKey:   contextSelect.value,
      contextLabel: contextos[contextSelect.value],
      optionA:      currentA.nombre,
      optionB:      currentB.nombre,
      winner:       winner.nombre,
      loser:        loser.nombre,
    };

    serverVotes.push(rec);
    serverStats.duelos++;
    rebuildFromVotes(serverVotes);
    renderAll();

    if (usingBackend && BACKEND_URL) {
      try { await sendVoteToBackend(rec); }
      catch { /* silent fallback */ }
    } else {
      persistLocalVote(rec);
    }

    showToast(`✓ ${winner.nombre}`);
    renderDuel(); // show next pair immediately, keep modal open
  }

  // ══════════════════════════════════════════════════════
  // NAV SCROLL
  // ══════════════════════════════════════════════════════
  window.addEventListener("scroll", () => {
    mainNav.classList.toggle("opaque", window.scrollY > 60);
  }, { passive: true });

  // ══════════════════════════════════════════════════════
  // EVENTS
  // ══════════════════════════════════════════════════════
  btnOpenDuel.addEventListener("click", openModal);
  modalClose.addEventListener("click", closeModal);
  duelModal.addEventListener("click", e => { if (e.target === duelModal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  btnA.addEventListener("click", () => vote("A"));
  btnB.addEventListener("click", () => vote("B"));
  btnNewPair.addEventListener("click", renderDuel);

  segmentSelect.addEventListener("change", renderAll);
  contextSelect.addEventListener("change", renderAll);
  facultySelect.addEventListener("change", renderAll);
  searchInput.addEventListener("input", renderAll);

  btnClear.addEventListener("click", () => {
    facultySelect.value = "all";
    searchInput.value = "";
    segmentSelect.value = "GLOBAL";
    contextSelect.value = "EMP";
    renderAll();
    showToast("Filtros restablecidos.");
  });

  btnRefresh.addEventListener("click", async () => {
    if (BACKEND_URL && usingBackend) {
      try {
        await loadBackendBootstrap();
        renderAll();
        showToast("Datos actualizados desde Sheets.");
      } catch {
        showToast("No fue posible actualizar desde Sheets.");
      }
    } else {
      bootstrapLocal();
      renderAll();
      showToast("Datos locales actualizados.");
    }
  });

  // ══════════════════════════════════════════════════════
  // INIT
  // ══════════════════════════════════════════════════════
  async function init() {
    fillSegmentSelect();
    fillContextSelect();
    fillFacultySelect();
    segmentSelect.value = "GLOBAL";
    contextSelect.value = "EMP";
    facultySelect.value = "all";

    buckets = createEmptyBuckets();

    if (BACKEND_URL) {
      try {
        await registerBackendVisitOnce();
        await loadBackendBootstrap();
        renderAll();
        showToast("Conectado con Google Sheets.");
      } catch {
        usingBackend = false;
        bootstrapLocal();
        registerVisitLocal();
        renderAll();
        showToast("Backend no disponible. Modo local activo.");
      }
    } else {
      bootstrapLocal();
      registerVisitLocal();
      renderAll();
      showToast("👋 Bienvenido — elige tu perfil y vota en un duelo para empezar");
    }
  }

  // ── ONBOARDING ────────────────────────────────────────────
  // Corre DESPUÉS de init() para que el modal ya esté listo
  function setupOnboarding() {
    const overlay    = document.getElementById("onboarding");
    const btnStart   = document.getElementById("btnOnboardingStart");
    const btnSkip    = document.getElementById("btnOnboardingSkip");
    const btnOpenDuel = document.getElementById("btnOpenDuel");

    if (!overlay) return;

    const SEEN_KEY  = "usb_elo_onboarded_v1";
    const alreadySeen = localStorage.getItem(SEEN_KEY);

    function closeOnboarding() {
      overlay.classList.add("hidden");
      // Remove from DOM after animation so it doesn't block clicks
      setTimeout(() => { overlay.style.display = "none"; }, 380);
      localStorage.setItem(SEEN_KEY, "1");
    }

    if (alreadySeen) {
      overlay.style.display = "none";
      return;
    }

    // Show overlay
    overlay.style.display = "flex";

    btnStart.addEventListener("click", () => {
      closeOnboarding();
      // Small delay so overlay fade-out feels intentional before modal opens
      setTimeout(() => btnOpenDuel.click(), 400);
    });

    btnSkip.addEventListener("click", closeOnboarding);

    // Also close on backdrop click
    overlay.addEventListener("click", e => {
      if (e.target === overlay) closeOnboarding();
    });
  }

  init().then(setupOnboarding);
});
