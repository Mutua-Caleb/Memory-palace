// LE MANOIR — audio engine
// Two halves:
//   1. HorrorAudio — a fully procedural Web Audio soundscape (wind, drone,
//      creaks, heartbeat, thunder, stingers). No samples, nothing canned.
//   2. Voice — speech via the Web Speech API, preferring the neural
//      "Online (Natural)" French voices that Microsoft Edge exposes.

/* ------------------------------------------------------------------ */
/*  Procedural horror soundscape                                       */
/* ------------------------------------------------------------------ */
const HorrorAudio = (() => {
  let ctx = null;
  let master, windGain, droneGain, heartGain;
  let started = false;
  let heartTimer = null;
  let creakTimer = null;
  let danger = 0; // 0..1, drives heartbeat tempo & mix darkness

  function ensureCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function makeNoiseBuffer(seconds = 2) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      // brown-ish noise: integrate white noise for a deep rumble
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
    return buf;
  }

  function startWind() {
    const noise = ctx.createBufferSource();
    noise.buffer = makeNoiseBuffer(4);
    noise.loop = true;

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 300;
    lp.Q.value = 0.8;

    // slow LFO sweeps the filter so the wind breathes and howls
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 180;
    lfo.connect(lfoGain).connect(lp.frequency);

    // a second, faster LFO on amplitude for gusts
    const gust = ctx.createOscillator();
    gust.frequency.value = 0.19;
    const gustGain = ctx.createGain();
    gustGain.gain.value = 0.05;

    windGain = ctx.createGain();
    windGain.gain.value = 0.12;
    gust.connect(gustGain).connect(windGain.gain);

    noise.connect(lp).connect(windGain).connect(master);
    noise.start();
    lfo.start();
    gust.start();
  }

  function startDrone() {
    droneGain = ctx.createGain();
    droneGain.gain.value = 0.045;
    const freqs = [55, 55.7, 27.5];
    freqs.forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 2 ? "triangle" : "sine";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = i === 2 ? 0.5 : 1;
      o.connect(g).connect(droneGain);
      o.start();
    });
    droneGain.connect(master);
  }

  function creak() {
    // a slow descending squeal through a narrow bandpass = floorboard / hinge
    const o = ctx.createOscillator();
    o.type = "sawtooth";
    const f0 = 400 + Math.random() * 700;
    o.frequency.setValueAtTime(f0, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(f0 * (0.4 + Math.random() * 0.3), ctx.currentTime + 0.7);

    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = f0;
    bp.Q.value = 12;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.03 + Math.random() * 0.03, ctx.currentTime + 0.15);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);

    const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    let tail = g;
    if (pan) { pan.pan.value = Math.random() * 2 - 1; g.connect(pan); tail = pan; }
    o.connect(bp).connect(g);
    tail.connect(master);
    o.start();
    o.stop(ctx.currentTime + 1);
  }

  function scheduleCreaks() {
    creakTimer = setTimeout(() => {
      creak();
      scheduleCreaks();
    }, 7000 + Math.random() * 14000);
  }

  function thump(when, strength) {
    // one heart thump: a pitched-down sine blip
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(70, when);
    o.frequency.exponentialRampToValueAtTime(38, when + 0.12);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(strength, when + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.22);
    o.connect(g).connect(heartGain);
    o.start(when);
    o.stop(when + 0.3);
  }

  function heartbeatLoop() {
    if (!started) return;
    const t = ctx.currentTime;
    const strength = 0.05 + danger * 0.30;
    thump(t, strength);
    thump(t + 0.28, strength * 0.7);
    const interval = 1500 - danger * 1000; // calm 1.5s → terror 0.5s
    heartTimer = setTimeout(heartbeatLoop, interval);
  }

  function thunder() {
    if (!started) return;
    const noise = ctx.createBufferSource();
    noise.buffer = makeNoiseBuffer(3);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(900, ctx.currentTime);
    lp.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 2.5);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.8);
    noise.connect(lp).connect(g).connect(master);
    noise.start();
    noise.stop(ctx.currentTime + 3);
  }

  function doorOpen() {
    if (!started) return;
    // long low creak + boom
    creak();
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(50, ctx.currentTime + 0.5);
    o.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 1.5);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime + 0.5);
    g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);
    o.connect(g).connect(master);
    o.start(ctx.currentTime + 0.5);
    o.stop(ctx.currentTime + 2);
  }

  function chime(good) {
    if (!started) return;
    const t = ctx.currentTime;
    const freqs = good ? [220, 277.18, 329.63] : [220, 233.08, 207.65]; // minor-ish vs dissonant cluster
    freqs.forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t + i * 0.05);
      g.gain.exponentialRampToValueAtTime(good ? 0.08 : 0.10, t + i * 0.05 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.05 + (good ? 1.2 : 0.5));
      o.connect(g).connect(master);
      o.start(t + i * 0.05);
      o.stop(t + i * 0.05 + 1.4);
    });
  }

  function jumpscare() {
    if (!started) return;
    const t = ctx.currentTime;
    // dissonant sawtooth cluster, pitch-bending upward — the classic stinger
    [110, 116, 233, 466.16, 622.25].forEach(f => {
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(f, t);
      o.frequency.exponentialRampToValueAtTime(f * 1.6, t + 0.9);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.16, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
      o.connect(g).connect(master);
      o.start(t);
      o.stop(t + 1.2);
    });
    // plus a harsh noise burst, like a scream of static
    const noise = ctx.createBufferSource();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 1, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    noise.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(1200, t);
    bp.frequency.exponentialRampToValueAtTime(3000, t + 0.4);
    bp.Q.value = 1.5;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.35, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    noise.connect(bp).connect(g).connect(master);
    noise.start(t);
    noise.stop(t + 1);
  }

  function start() {
    if (started) return;
    ensureCtx();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
    heartGain = ctx.createGain();
    heartGain.gain.value = 1;
    heartGain.connect(master);
    startWind();
    startDrone();
    started = true;
    heartbeatLoop();
    scheduleCreaks();
  }

  function setDanger(d) {
    danger = Math.max(0, Math.min(1, d));
    if (started && droneGain) {
      droneGain.gain.setTargetAtTime(0.045 + danger * 0.06, ctx.currentTime, 0.5);
      windGain.gain.setTargetAtTime(0.12 + danger * 0.10, ctx.currentTime, 0.5);
    }
  }

  function stop() {
    started = false;
    if (heartTimer) clearTimeout(heartTimer);
    if (creakTimer) clearTimeout(creakTimer);
    if (ctx) { ctx.close(); ctx = null; }
  }

  return { start, stop, setDanger, thunder, doorOpen, chime, jumpscare,
    get started() { return started; } };
})();

/* ------------------------------------------------------------------ */
/*  Speech — realistic French voices                                   */
/* ------------------------------------------------------------------ */
const Voice = (() => {
  let frVoices = [];
  let chosen = null;

  // Higher score = more natural. Edge's neural voices announce themselves
  // with "Online (Natural)"; Chrome's best fallback is "Google français".
  function score(v) {
    let s = 0;
    if (/natural/i.test(v.name)) s += 100;
    if (/neural/i.test(v.name)) s += 90;
    if (/online/i.test(v.name)) s += 20;
    if (/google/i.test(v.name)) s += 40;
    if (/denise|henri|vivienne|eloise|remy/i.test(v.name)) s += 10;
    if (v.lang === "fr-FR") s += 5;
    return s;
  }

  function refresh() {
    const all = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    frVoices = all.filter(v => v.lang && v.lang.toLowerCase().startsWith("fr"))
                  .sort((a, b) => score(b) - score(a));
    if (!chosen || !frVoices.includes(chosen)) chosen = frVoices[0] || null;
    return frVoices;
  }

  if (window.speechSynthesis) {
    refresh();
    speechSynthesis.onvoiceschanged = () => {
      refresh();
      document.dispatchEvent(new CustomEvent("voices-ready"));
    };
  }

  function speak(text, { rate = 0.92, pitch = 1.0, volume = 1.0, whisper = false, onend = null } = {}) {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "fr-FR";
    if (chosen) u.voice = chosen;
    u.rate = whisper ? 0.7 : rate;
    u.pitch = whisper ? 0.4 : pitch;
    u.volume = whisper ? 0.45 : volume;
    if (onend) u.onend = onend;
    speechSynthesis.speak(u);
  }

  function setVoice(name) {
    const v = frVoices.find(v => v.name === name);
    if (v) chosen = v;
  }

  return {
    speak,
    setVoice,
    refresh,
    get voices() { return frVoices; },
    get chosen() { return chosen; }
  };
})();
