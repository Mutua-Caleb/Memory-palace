// LE MANOIR — game logic

/* ------------------------------------------------------------------ */
/*  helpers                                                            */
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

// strip punctuation & extra spaces; keep accents (accent check is separate)
function clean(s) {
  return s.toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[?!.,;:«»"()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
// fully fold accents away
function fold(s) {
  return clean(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/œ/g, "oe");
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
/*  settings (start screen)                                            */
/* ------------------------------------------------------------------ */
const settings = { lang: "fr", diff: "normal" };
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
/*  atmosphere: grain, flashlight, lightning, whispers                 */
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

const flashlight = $("flashlight");
addEventListener("pointermove", e => {
  flashlight.style.setProperty("--mx", (e.clientX / innerWidth * 100) + "%");
  flashlight.style.setProperty("--my", (e.clientY / innerHeight * 100) + "%");
});

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
  }, 25000 + Math.random() * 30000 * (1 - G.danger * 0.6));
}

/* ------------------------------------------------------------------ */
/*  game state                                                         */
/* ------------------------------------------------------------------ */
const G = {
  running: false,
  roomIdx: 0,
  queue: [],        // words left in current room
  word: null,       // current word object
  hearts: 3,
  danger: 0,        // 0..1
  score: 0,
  streak: 0,
  best: +(localStorage.getItem("manoir-best") || 0),
  missed: [],       // words answered wrong at least once
  missedSet: new Set(),
  timerId: null,
  deadline: 0,
  awaiting: false   // true while waiting for an answer
};

function setDanger(d) {
  G.danger = Math.max(0, Math.min(1, d));
  document.documentElement.style.setProperty("--danger", G.danger.toFixed(3));
  document.body.classList.toggle("danger-high", G.danger > 0.65);
  HorrorAudio.setDanger(G.danger);
}

function renderHUD() {
  $("hearts").innerHTML = Array.from({ length: 3 },
    (_, i) => `<span class="${i < G.hearts ? "" : "lost"}">🖤</span>`).join("");
  $("doors").innerHTML = ROOMS.map((r, i) =>
    `<div class="door-pip ${i < G.roomIdx ? "open" : ""} ${i === G.roomIdx ? "current" : ""}" title="${r.fr}"></div>`
  ).join("");
  $("score").textContent = G.score;
  $("streak").textContent = G.streak >= 3 ? `🔥 ${G.streak} de suite` : "";
}

/* ------------------------------------------------------------------ */
/*  word round                                                         */
/* ------------------------------------------------------------------ */
function speakWord(slow = false) {
  if (!G.word) return;
  const btn = $("speak-btn");
  btn.classList.add("speaking");
  Voice.speak(G.word.fr, { rate: slow ? 0.55 : 0.92, onend: () => btn.classList.remove("speaking") });
}

function startTimer() {
  stopTimer();
  const total = DIFF[settings.diff].time * 1000;
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

function nextWord() {
  if (!G.queue.length) { roomCleared(); return; }
  G.word = G.queue.shift();
  G.awaiting = true;
  $("answer").value = "";
  $("hint-line").textContent = "";
  $("feedback").innerHTML = "";
  $("answer").focus();
  setTimeout(() => speakWord(), 450);
  startTimer();
}

function markMissed(word) {
  if (!G.missedSet.has(word.fr)) {
    G.missedSet.add(word.fr);
    G.missed.push(word);
  }
}

function onTimeout() {
  if (!G.awaiting) return;
  stopTimer();
  markMissed(G.word);
  G.streak = 0;
  setDanger(G.danger + 0.18);
  HorrorAudio.chime(false);
  $("feedback").innerHTML = `<span class="bad">Trop lent… il approche. — Too slow… it's getting closer.</span>`;
  G.queue.push(G.word); // the word will return
  renderHUD();
  if (G.danger >= 1) { caught(); return; }
  setTimeout(nextWord, 1600);
  G.awaiting = false;
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
  const ens = enForms(w.en);
  const enHit = ens.some(f => ansFold === fold(f));

  if (settings.lang !== "en" && (frExact || (frFolded && !accents))) {
    return { ok: true, lang: "fr", accentPerfect: frExact };
  }
  if (settings.lang !== "fr" && enHit) {
    return { ok: true, lang: "en", accentPerfect: true };
  }
  // nightmare: right word, wrong accents → near miss
  if (settings.lang !== "en" && accents && frFolded && !frExact) {
    return { ok: false, nearAccent: true };
  }
  return { ok: false };
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
    const points = res.lang === "fr" ? 10 : 5;
    G.streak++;
    const bonus = Math.min(G.streak, 5);
    G.score += points + bonus;
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
    setTimeout(nextWord, 1700);
  } else {
    markMissed(w);
    G.streak = 0;
    setDanger(G.danger + 0.22);
    HorrorAudio.chime(false);
    $("answer").classList.add("shake");
    setTimeout(() => $("answer").classList.remove("shake"), 400);
    const jeer = rand(VOICE_LINES.wrong);
    setTimeout(() => Voice.speak(jeer.fr, { volume: 0.8, pitch: 0.7 }), 300);
    let msg = `<span class="bad">✗ ${jeer.fr} — il se rapproche…</span>`;
    if (res.nearAccent) {
      msg = `<span class="bad">✗ Les accents, exactement : <b>${w.fr}</b></span>`;
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
/*  rooms / lives / endings                                            */
/* ------------------------------------------------------------------ */
function enterRoom() {
  const room = ROOMS[G.roomIdx];
  $("room-title").textContent = room.fr;
  $("room-sub").innerHTML = `${room.desc}<br><em>${room.descEn}</em>`;
  G.queue = shuffle(room.words);
  renderHUD();
  HorrorAudio.doorOpen();
  const line = rand(VOICE_LINES.enterRoom);
  Voice.speak(line.fr, { volume: 0.85, onend: () => setTimeout(nextWord, 400) });
  // fallback in case speech fails silently
  setTimeout(() => { if (!G.word && G.running) nextWord(); }, 3000);
}

function roomCleared() {
  G.word = null;
  G.awaiting = false;
  stopTimer();
  setDanger(Math.max(0, G.danger - 0.3));
  G.roomIdx++;
  renderHUD();
  if (G.roomIdx >= ROOMS.length) { victory(); return; }
  const next = ROOMS[G.roomIdx];
  $("inter-title").textContent = `Porte ${G.roomIdx + 1} — ${next.fr}`;
  $("inter-desc").innerHTML = `${next.desc}<br><em>${next.descEn}</em>`;
  $("interlude").classList.remove("hidden");
  $("inter-btn").focus();
}
$("inter-btn").addEventListener("click", () => {
  $("interlude").classList.add("hidden");
  enterRoom();
});

function caught() {
  stopTimer();
  G.awaiting = false;
  G.word = null;
  // JUMPSCARE
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
    $("feedback").innerHTML = `<span class="bad">Il t'a frôlé… il te reste ${G.hearts} ❤. — It brushed past you… ${G.hearts} left.</span>`;
    Voice.speak("Tu ne peux pas m'échapper…", { whisper: true });
    setTimeout(nextWord, 2000);
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
  $("play").style.display = "none";
  $("go-stats").innerHTML = endStats();
  buildReview($("review-list"));
  $("gameover").classList.remove("hidden");
  Voice.speak("Reste avec nous… pour toujours.", { whisper: true });
}

function victory() {
  G.running = false;
  stopTimer();
  document.body.classList.add("dawn");
  $("play").style.display = "none";
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
    running: true, roomIdx: 0, queue: [], word: null, hearts: 3,
    danger: 0, score: 0, streak: 0, missed: [], missedSet: new Set(),
    awaiting: false
  });
  document.body.classList.remove("dawn");
  setDanger(0);
  $("hud").style.visibility = "visible";
  $("play").style.display = "block";
  renderHUD();
  enterRoom();
}

$("start-btn").addEventListener("click", () => {
  HorrorAudio.start();
  Voice.refresh();
  $("start").classList.add("hidden");
  scheduleStorm();
  scheduleWhispers();
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
$("answer").addEventListener("keydown", e => { if (e.key === "Enter") onSubmit(); });
$("speak-btn").addEventListener("click", () => speakWord());
$("replay-btn").addEventListener("click", () => speakWord());
$("slow-btn").addEventListener("click", () => speakWord(true));
$("hint-btn").addEventListener("click", showHint);
