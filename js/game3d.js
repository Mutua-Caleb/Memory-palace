// LE PALAIS DE MÉMOIRE — 3D game controller
// Walk the voxel palace (world3d.js); this file owns the learning loop:
// challenges, answer checking, scoring, danger, scares, endings.

/* ------------------------------------------------------------------ */
/*  helpers (shared with the classic version)                          */
/* ------------------------------------------------------------------ */
const $ = id => document.getElementById(id);
const rand = arr => arr[Math.floor(Math.random() * arr.length)];

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function clean(s) {
  return s.toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/-/g, " ")
    .replace(/[?!.,;:«»"()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function fold(s) {
  return clean(s).normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/œ/g, "oe").replace(/'/g, "");
}
const FR_ARTICLES = /^(le |la |les |l'|un |une |des )/;
const EN_ARTICLES = /^(the |a |an |to )/;
function frForms(fr) {
  const c = clean(fr);
  const out = new Set([c]);
  if (FR_ARTICLES.test(c)) out.add(c.replace(FR_ARTICLES, ""));
  return [...out];
}
function enForms(enList) {
  const out = new Set();
  enList.forEach(e => {
    const c = clean(e);
    out.add(c);
    out.add(c.replace(EN_ARTICLES, ""));
    out.add("the " + c.replace(EN_ARTICLES, ""));
  });
  return [...out];
}

/* ------------------------------------------------------------------ */
/*  settings                                                           */
/* ------------------------------------------------------------------ */
const settings = { lang: "fr", diff: "normal", subs: "first" };
const DIFF = {
  easy:      { time: 35, accentsRequired: false },
  normal:    { time: 22, accentsRequired: false },
  nightmare: { time: 12, accentsRequired: true }
};

function wireChoiceRow(rowId, key) {
  $(rowId).addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    $(rowId).querySelectorAll("button").forEach(x => x.classList.remove("sel"));
    b.classList.add("sel");
    settings[key] = b.dataset.v;
  });
}
wireChoiceRow("lang-row", "lang");
wireChoiceRow("diff-row", "diff");
wireChoiceRow("sub-row", "subs");

function fillVoices() {
  const sel = $("voice-select");
  const voices = Voice.refresh();
  sel.innerHTML = "";
  if (!voices.length) {
    const o = document.createElement("option");
    o.textContent = "Aucune voix française détectée — le navigateur en chargera peut-être après le démarrage";
    sel.appendChild(o);
    return;
  }
  voices.forEach(v => {
    const o = document.createElement("option");
    o.value = v.name;
    const natural = /natural|neural/i.test(v.name) ? " ★ réaliste" : "";
    o.textContent = `${v.name} (${v.lang})${natural}`;
    if (Voice.chosen && v.name === Voice.chosen.name) o.selected = true;
    sel.appendChild(o);
  });
}
fillVoices();
document.addEventListener("voices-ready", fillVoices);
$("voice-select").addEventListener("change", e => Voice.setVoice(e.target.value));

/* ------------------------------------------------------------------ */
/*  atmosphere overlays: grain, rain, drips, scares, whispers, storm   */
/* ------------------------------------------------------------------ */
(function grain() {
  const cv = $("grain");
  const cx = cv.getContext("2d");
  function size() { cv.width = innerWidth / 2; cv.height = innerHeight / 2; }
  size();
  addEventListener("resize", size);
  (function frame() {
    const img = cx.createImageData(cv.width, cv.height);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = Math.random() * 255 | 0;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 22;
    }
    cx.putImageData(img, 0, 0);
    setTimeout(() => requestAnimationFrame(frame), 70);
  })();
})();

(function rainCanvas() {
  const cv = $("rain");
  const c = cv.getContext("2d");
  function size() { cv.width = innerWidth; cv.height = innerHeight; }
  size();
  addEventListener("resize", size);
  const drops = Array.from({ length: 130 }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    l: 8 + Math.random() * 18,
    v: 9 + Math.random() * 9
  }));
  (function f() {
    c.clearRect(0, 0, cv.width, cv.height);
    c.strokeStyle = "rgba(170, 185, 210, 0.22)";
    c.lineWidth = 1;
    drops.forEach(d => {
      c.beginPath();
      c.moveTo(d.x, d.y);
      c.lineTo(d.x - 2, d.y + d.l);
      c.stroke();
      d.y += d.v;
      d.x -= 1.2;
      if (d.y > cv.height) { d.y = -25; d.x = Math.random() * (cv.width + 120); }
      if (d.x < -15) d.x = cv.width + 10;
    });
    requestAnimationFrame(f);
  })();
})();

setInterval(() => {
  if (!G.running) return;
  const n = G.danger > 0.5 ? 2 : 1;
  for (let i = 0; i < n; i++) {
    const d = document.createElement("div");
    d.className = "drip";
    d.style.left = Math.random() * 100 + "vw";
    d.style.setProperty("--len", (40 + Math.random() * 130) + "px");
    d.style.animationDuration = (3.5 + Math.random() * 4) + "s";
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 9000);
  }
}, 3000);

function bloodSplat() {
  const v = $("blood-vignette");
  v.style.transition = "opacity 0.05s";
  v.style.opacity = "0.95";
  setTimeout(() => {
    v.style.transition = "opacity 1.4s";
    v.style.opacity = (G.danger * 0.55).toFixed(2);
  }, 130);
}

let scareTimer = null;
function shadeDart() {
  const s = $("shade");
  s.style.bottom = (12 + Math.random() * 40) + "vh";
  HorrorAudio.screech();
  s.classList.remove("dart");
  void s.offsetWidth;
  s.classList.add("dart");
}
function faceFlash() {
  const f = $("face-flash");
  f.style.display = "flex";
  HorrorAudio.screech();
  setTimeout(() => { f.style.display = "none"; }, 90);
}
function scheduleScares() {
  scareTimer = setTimeout(() => {
    if (G.running) {
      if (G.danger > 0.7 && Math.random() < 0.45) faceFlash();
      else if (G.danger > 0.3 || Math.random() < 0.25) shadeDart();
    }
    scheduleScares();
  }, 9000 + Math.random() * 15000);
}

let stormTimer = null;
function scheduleStorm() {
  stormTimer = setTimeout(() => {
    if (G.running) {
      document.body.classList.add("flash");
      HorrorAudio.thunder();
      setTimeout(() => document.body.classList.remove("flash"), 130);
      setTimeout(() => {
        document.body.classList.add("flash");
        setTimeout(() => document.body.classList.remove("flash"), 90);
      }, 280);
    }
    scheduleStorm();
  }, 20000 + Math.random() * 35000);
}

let whisperTimer = null;
function scheduleWhispers() {
  whisperTimer = setTimeout(() => {
    if (G.running && window.speechSynthesis && !speechSynthesis.speaking) {
      const w = rand(WHISPERS);
      Voice.speak(w.fr, { whisper: true });
      const line = $("whisper-line");
      line.innerHTML = `« ${w.fr} »<small>${w.en}</small>`;
      line.classList.add("show");
      setTimeout(() => line.classList.remove("show"), 4500);
    }
    scheduleWhispers();
  }, 25000 + Math.random() * 30000);
}

/* ------------------------------------------------------------------ */
/*  game state                                                         */
/* ------------------------------------------------------------------ */
const G = {
  running: false,
  roomIdx: 0,
  items: [],          // this room's words, indexed by orb
  word: null,
  orbIdx: -1,
  sentQueue: [],
  phase: "words",
  hearts: 3,
  danger: 0,
  score: 0,
  streak: 0,
  best: +(localStorage.getItem("manoir-best") || 0),
  missed: [],
  missedSet: new Set(),
  timerId: null,
  deadline: 0,
  attempts: 0,
  awaiting: false,
  challengeOpen: false
};

// words whose subtitle has already been shown once (persisted)
const seenWords = new Set(JSON.parse(localStorage.getItem("manoir-seen") || "[]"));
function markSeen(fr) {
  if (seenWords.has(fr)) return;
  seenWords.add(fr);
  localStorage.setItem("manoir-seen", JSON.stringify([...seenWords]));
}
$("forget-btn").addEventListener("click", () => {
  seenWords.clear();
  localStorage.removeItem("manoir-seen");
  $("forget-btn").textContent = "Mémoire effacée — les sous-titres réapparaîtront ✓";
});

function setDanger(d) {
  G.danger = Math.max(0, Math.min(1, d));
  document.body.classList.toggle("danger-high", G.danger > 0.65);
  $("blood-vignette").style.opacity = (G.danger * 0.55).toFixed(2);
  HorrorAudio.setDanger(G.danger);
  World.setDanger(G.danger);
}

// fear fades a little while you explore — but never fully
setInterval(() => {
  if (G.running && !G.challengeOpen && G.danger > 0.05) setDanger(G.danger - 0.015);
}, 1000);

function renderHUD() {
  $("hearts").innerHTML = Array.from({ length: 3 },
    (_, i) => `<span class="${i < G.hearts ? "" : "lost"}">🖤</span>`).join("");
  $("doors").innerHTML = ROOMS.map((r, i) =>
    `<div class="door-pip ${i < G.roomIdx ? "open" : ""} ${i === G.roomIdx ? "current" : ""}" title="${r.fr}"></div>`
  ).join("");
  $("score").textContent = G.score;
  $("streak").textContent = G.streak >= 3 ? `🔥 ${G.streak} de suite` : "";
}
function setObjective(txt) { $("objective").innerHTML = txt; }

/* ------------------------------------------------------------------ */
/*  subtitles & speech                                                 */
/* ------------------------------------------------------------------ */
function displaySubtitle(w) {
  const s = $("subtitle-top");
  const long = w.fr.length > 24;
  s.innerHTML = `<div class="fr-line${long ? " long" : ""}">« ${w.fr} »</div><div class="en-line">${w.en[0]}</div>`;
  s.classList.add("show");
}
function showSubtitle(w) {
  if (settings.subs === "off") return;
  if (settings.subs === "first" && seenWords.has(w.fr)) return;
  markSeen(w.fr);
  displaySubtitle(w);
}

function speakWord(slow = false) {
  if (!G.word) return;
  const btn = $("speak-btn");
  btn.classList.add("speaking");
  showSubtitle(G.word);
  Voice.speak(G.word.fr, { rate: slow ? 0.55 : 0.92, onend: () => btn.classList.remove("speaking") });
}

/* ------------------------------------------------------------------ */
/*  timer                                                              */
/* ------------------------------------------------------------------ */
function startTimer() {
  stopTimer();
  const mult = G.phase === "sentences" ? 1.9 : 1;
  const total = DIFF[settings.diff].time * 1000 * mult;
  G.deadline = performance.now() + total;
  const ring = $("timer-ring");
  G.timerId = setInterval(() => {
    const left = G.deadline - performance.now();
    ring.style.setProperty("--t", Math.max(0, left / total).toFixed(3));
    if (left <= 0) onTimeout();
  }, 100);
}
function stopTimer() {
  if (G.timerId) clearInterval(G.timerId);
  G.timerId = null;
}

/* ------------------------------------------------------------------ */
/*  challenge open/close                                               */
/* ------------------------------------------------------------------ */
function openChallenge(item, orbIdx) {
  G.word = item;
  G.orbIdx = orbIdx;
  G.awaiting = true;
  G.attempts = 0;
  G.challengeOpen = true;
  World.setUILock(true);
  $("c-room").textContent = ROOMS[G.roomIdx].fr +
    (G.phase === "sentences" ? " — ✒️ la dictée" : "");
  $("subtitle-top").classList.remove("show");
  $("answer").value = "";
  $("hint-line").textContent = "";
  $("feedback").innerHTML = "";
  $("answer").placeholder = G.phase === "sentences"
    ? "Écris la phrase complète en français…" : "Tape ce que tu entends…";
  $("challenge").classList.add("show");
  $("answer").focus();
  setTimeout(() => speakWord(), 420);
  startTimer();
}

function closeChallenge() {
  stopTimer();
  G.word = null;
  G.awaiting = false;
  G.challengeOpen = false;
  $("challenge").classList.remove("show");
  $("subtitle-top").classList.remove("show");
  World.setUILock(false);
  World.rearmOrbs();
}

/* ------------------------------------------------------------------ */
/*  answer checking                                                    */
/* ------------------------------------------------------------------ */
function markMissed(word) {
  if (!G.missedSet.has(word.fr)) {
    G.missedSet.add(word.fr);
    G.missed.push(word);
  }
}

function checkAnswer(raw) {
  const w = G.word;
  const accents = DIFF[settings.diff].accentsRequired;
  const ansClean = clean(raw);
  const ansFold = fold(raw);
  if (!ansClean) return { ok: false };

  const frs = frForms(w.fr);
  const frExact = frs.some(f => ansClean === f);
  const frFolded = frs.some(f => ansFold === fold(f));

  if (G.phase === "sentences") {
    if (frExact || (frFolded && !accents)) {
      return { ok: true, lang: "fr", accentPerfect: frExact };
    }
    if (accents && frFolded && !frExact) return { ok: false, nearAccent: true };
    return { ok: false };
  }

  const ens = enForms(w.en);
  const enHit = ens.some(f => ansFold === fold(f));

  if (settings.lang !== "en" && (frExact || (frFolded && !accents))) {
    return { ok: true, lang: "fr", accentPerfect: frExact };
  }
  if (settings.lang !== "fr" && enHit) {
    return { ok: true, lang: "en", accentPerfect: true };
  }
  if (settings.lang !== "en" && accents && frFolded && !frExact) {
    return { ok: false, nearAccent: true };
  }
  return { ok: false };
}

function onTimeout() {
  if (!G.awaiting) return;
  stopTimer();
  markMissed(G.word);
  G.streak = 0;
  setDanger(G.danger + 0.18);
  HorrorAudio.chime(false);
  $("feedback").innerHTML = `<span class="bad">Trop lent… il approche. — Too slow… it's getting closer.</span>`;
  renderHUD();
  if (G.danger >= 1) { caught(); return; }
  setTimeout(() => speakWord(), 1100);
  startTimer();
}

function onSubmit() {
  if (!G.awaiting || !G.word) return;
  const raw = $("answer").value;
  if (!clean(raw)) { speakWord(); return; }
  const res = checkAnswer(raw);
  const w = G.word;

  if (res.ok) {
    stopTimer();
    G.awaiting = false;
    const points = G.phase === "sentences" ? 25 : (res.lang === "fr" ? 10 : 5);
    G.streak++;
    G.score += points + Math.min(G.streak, 5);
    setDanger(G.danger - 0.12);
    HorrorAudio.chime(true);
    const praise = rand(VOICE_LINES.correct);
    setTimeout(() => Voice.speak(praise.fr, { volume: 0.8 }), 350);
    let msg = `<span class="good">✓ ${praise.fr} — <b>${w.fr}</b> = ${w.en[0]}</span>`;
    if (res.lang === "en") {
      msg += `<span class="accent-note">En français : <b>${w.fr}</b> — type it in French next time for double points!</span>`;
    } else if (!res.accentPerfect) {
      msg += `<span class="accent-note">Presque parfait — attention aux accents : <b>${w.fr}</b></span>`;
    }
    $("feedback").innerHTML = msg;
    renderHUD();

    if (G.phase === "sentences") {
      setTimeout(nextSentence, 1700);
    } else {
      World.solveOrb(G.orbIdx);
      const left = World.orbsLeft();
      if (left === 0) {
        setObjective("✒️ Va à la <b>porte</b> — la dictée t'attend. <em>Go to the door — the dictation awaits.</em>");
        World.armDoor();
        setTimeout(() => Voice.speak("Va à la porte… des phrases complètes t'attendent.", { volume: 0.85 }), 1400);
      } else {
        setObjective(`Blocs lumineux restants : <b>${left}</b>`);
      }
      setTimeout(closeChallenge, 1700);
    }
  } else {
    markMissed(w);
    G.streak = 0;
    G.attempts++;
    setDanger(G.danger + 0.22);
    bloodSplat();
    HorrorAudio.chime(false);
    $("answer").classList.add("shake");
    setTimeout(() => $("answer").classList.remove("shake"), 400);
    const jeer = rand(VOICE_LINES.wrong);
    setTimeout(() => Voice.speak(jeer.fr, { volume: 0.8, pitch: 0.7 }), 300);
    let msg = `<span class="bad">✗ ${jeer.fr} — il se rapproche…</span>`;
    if (res.nearAccent) {
      msg = `<span class="bad">✗ Les accents, exactement : <b>${w.fr}</b></span>`;
    }
    if (G.attempts >= 2) {
      displaySubtitle(w);
      msg += `<span class="accent-note">Lis-la, écris-la, apprends-la. — Read it, type it, learn it.</span>`;
    }
    $("feedback").innerHTML = msg;
    renderHUD();
    if (G.danger >= 1) { caught(); return; }
    $("answer").value = "";
    setTimeout(() => speakWord(), 900);
  }
}

function showHint() {
  if (!G.word) return;
  const w = G.word;
  const first = w.fr.replace(FR_ARTICLES, "")[0].toUpperCase();
  $("hint-line").textContent = `Indice : ${w.hint} — ça commence par « ${first} »`;
  G.score = Math.max(0, G.score - 2);
  setDanger(G.danger + 0.05);
  renderHUD();
}

/* ------------------------------------------------------------------ */
/*  room / dictation / endings                                         */
/* ------------------------------------------------------------------ */
function showInterlude(i) {
  World.setUILock(true);
  const room = ROOMS[i];
  $("inter-title").textContent = `Porte ${i + 1} — ${room.fr}`;
  $("inter-desc").innerHTML = `${room.desc}<br><em>${room.descEn}</em>`;
  $("interlude").classList.remove("hidden");
  $("inter-btn").focus();
}
$("inter-btn").addEventListener("click", () => {
  $("interlude").classList.add("hidden");
  enterRoom(G.roomIdx);
});

function enterRoom(i) {
  G.roomIdx = i;
  G.phase = "words";
  G.items = shuffle(ROOMS[i].words);
  World.startRoom(i, G.items.length);
  renderHUD();
  setObjective(`Blocs lumineux restants : <b>${G.items.length}</b> — marche dedans pour entendre un mot`);
  const line = rand(VOICE_LINES.enterRoom);
  Voice.speak(line.fr, { volume: 0.85 });
  HorrorAudio.doorOpen();
  World.setUILock(false);
}

World.bind({
  onOrb(idx) {
    if (!G.running) return;
    openChallenge(G.items[idx], idx);
  },
  onDoor() {
    if (!G.running) return;
    G.phase = "sentences";
    G.sentQueue = shuffle(SENTENCES[ROOMS[G.roomIdx].id] || []);
    G.challengeOpen = true;
    World.setUILock(true);
    $("challenge").classList.add("show");
    $("feedback").innerHTML =
      `<span class="good">✒️ La porte exige des phrases complètes, en français. — ` +
      `The door demands full sentences, in French.</span>`;
    Voice.speak("Et maintenant… des phrases complètes.", { volume: 0.85 });
    setTimeout(nextSentence, 2400);
  },
  onCrossed() {
    World.closeDoorBehind(G.roomIdx);
    HorrorAudio.slam();
    G.roomIdx++;
    renderHUD();
    setDanger(Math.max(0, G.danger - 0.3));
    if (G.roomIdx >= ROOMS.length) { victory(); return; }
    showInterlude(G.roomIdx);
  }
});

function nextSentence() {
  if (!G.running) return;
  if (!G.sentQueue.length) {
    closeChallenge();
    World.openDoor();
    HorrorAudio.doorOpen();
    setObjective("La porte est ouverte — <b>passe-la</b>. <em>The door is open — walk through.</em>");
    Voice.speak(rand(VOICE_LINES.enterRoom).fr, { volume: 0.85 });
    return;
  }
  const item = G.sentQueue.shift();
  openChallenge(item, -1);
}

function caught() {
  stopTimer();
  G.awaiting = false;
  if (G.phase === "sentences" && G.word) G.sentQueue.push(G.word);
  HorrorAudio.jumpscare();
  const js = $("jumpscare");
  js.classList.add("show");
  document.body.classList.add("shake-hard");
  setTimeout(() => {
    js.classList.remove("show");
    document.body.classList.remove("shake-hard");
    G.hearts--;
    renderHUD();
    if (G.hearts <= 0) { gameOver(); return; }
    setDanger(0.45);
    Voice.speak("Tu ne peux pas m'échapper…", { whisper: true });
    if (G.phase === "sentences") {
      $("feedback").innerHTML = `<span class="bad">Il t'a frôlé… il te reste ${G.hearts} ❤.</span>`;
      setTimeout(nextSentence, 1800);
    } else {
      closeChallenge(); // the orb stays — face it again
      setObjective(`Il t'a frôlé… il te reste <b>${G.hearts}</b> ❤. Blocs restants : <b>${World.orbsLeft()}</b>`);
    }
  }, 1300);
}

function buildReview(el) {
  if (!G.missed.length) {
    el.innerHTML = `<em>Aucun mot raté. Parfait. — No missed words. Perfect.</em>`;
    return;
  }
  el.innerHTML = G.missed.map((w, i) =>
    `<div><button class="relisten" data-i="${i}" title="Réécouter">🔊</button>` +
    `<span class="fr">${w.fr}</span> — <span class="en">${w.en[0]}</span></div>`).join("");
  el.onclick = e => {
    const b = e.target.closest("button.relisten");
    if (b) Voice.speak(G.missed[+b.dataset.i].fr);
  };
}

function endStats() {
  if (G.score > G.best) {
    G.best = G.score;
    localStorage.setItem("manoir-best", G.best);
  }
  return `Score : <b>${G.score}</b> &nbsp;·&nbsp; Record : <b>${G.best}</b><br>` +
         `Portes ouvertes : <b>${G.roomIdx} / ${ROOMS.length}</b> &nbsp;·&nbsp; ` +
         `Mots à réviser : <b>${G.missed.length}</b>`;
}

function gameOver() {
  G.running = false;
  document.body.classList.remove("playing");
  closeChallenge();
  World.setUILock(true);
  $("go-stats").innerHTML = endStats();
  buildReview($("review-list"));
  $("gameover").classList.remove("hidden");
  Voice.speak("Reste avec nous… pour toujours.", { whisper: true });
}

function victory() {
  G.running = false;
  document.body.classList.remove("playing");
  closeChallenge();
  World.setUILock(true);
  World.dawn();
  $("win-stats").innerHTML = endStats();
  buildReview($("review-list-win"));
  $("victory").classList.remove("hidden");
  HorrorAudio.chime(true);
  Voice.speak("Félicitations. Tu es libre.", { rate: 0.85 });
}

/* ------------------------------------------------------------------ */
/*  wiring                                                             */
/* ------------------------------------------------------------------ */
function resetGame() {
  Object.assign(G, {
    running: true, roomIdx: 0, items: [], word: null, orbIdx: -1,
    sentQueue: [], phase: "words", hearts: 3, danger: 0, score: 0,
    streak: 0, missed: [], missedSet: new Set(), attempts: 0,
    awaiting: false, challengeOpen: false
  });
  document.body.classList.add("playing");
  setDanger(0);
  $("hud").style.visibility = "visible";
  renderHUD();
  showInterlude(0);
}

let worldInited = false;
$("start-btn").addEventListener("click", () => {
  if (!window.THREE) {
    alert("Three.js n'a pas pu se charger — essaie la version classique (classic.html).");
    return;
  }
  HorrorAudio.start();
  Voice.refresh();
  if (!worldInited) { World.init(); worldInited = true; }
  $("start").classList.add("hidden");
  scheduleStorm();
  scheduleWhispers();
  scheduleScares();
  resetGame();
});
$("retry-btn").addEventListener("click", () => {
  $("gameover").classList.add("hidden");
  resetGame();
});
$("again-btn").addEventListener("click", () => {
  $("victory").classList.add("hidden");
  resetGame();
});

$("submit").addEventListener("click", onSubmit);
$("answer").addEventListener("keydown", e => {
  if (e.key === "Enter") onSubmit();
  e.stopPropagation(); // typing must never move the player
});
$("speak-btn").addEventListener("click", () => speakWord());
$("replay-btn").addEventListener("click", () => speakWord());
$("slow-btn").addEventListener("click", () => speakWord(true));
$("hint-btn").addEventListener("click", showHint);
