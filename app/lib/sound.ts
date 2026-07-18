"use client";

/* ----------------------------------------------------------------------------
 * Tiny Web Audio synth for tactile UI sounds (original — no external assets).
 * "Woody knock": a resonant band-passed noise burst (the wooden ring) + a sharp
 * high-passed transient (the click) + a low triangle body (the thump).
 * Two distinct voices — a light high tick for hover, a fuller low knock for click.
 * AudioContext is created lazily and resumed on the first user gesture.
 * --------------------------------------------------------------------------*/

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function getNoise(c: AudioContext): AudioBuffer {
  if (!noise) {
    const len = Math.floor(c.sampleRate * 0.08);
    noise = c.createBuffer(1, len, c.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }
  return noise;
}

type KnockOpts = {
  level?: number; // overall volume
  dur?: number; // wooden ring decay
  tone?: number; // wood resonance freq
  q?: number; // resonance sharpness (higher = woodier ring)
  body?: number; // low thump freq
  click?: number; // amount of sharp high transient (0–1)
};

function knock({ level = 0.16, dur = 0.08, tone = 430, q = 6, body = 180, click = 0.6 }: KnockOpts = {}) {
  const c = ac();
  if (!c) return;
  const t = c.currentTime;

  // 1) wooden ring — noise through a resonant bandpass
  const ring = c.createBufferSource();
  ring.buffer = getNoise(c);
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = tone;
  bp.Q.value = q;
  const rg = c.createGain();
  rg.gain.setValueAtTime(level, t);
  rg.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  ring.connect(bp);
  bp.connect(rg);
  rg.connect(c.destination);
  ring.start(t);
  ring.stop(t + dur + 0.02);

  // 2) click transient — very short high-passed noise
  const clk = c.createBufferSource();
  clk.buffer = getNoise(c);
  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 2800;
  const cg = c.createGain();
  cg.gain.setValueAtTime(level * click, t);
  cg.gain.exponentialRampToValueAtTime(0.0001, t + 0.007);
  clk.connect(hp);
  hp.connect(cg);
  cg.connect(c.destination);
  clk.start(t);
  clk.stop(t + 0.02);

  // 3) low body thump
  const osc = c.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(body, t);
  osc.frequency.exponentialRampToValueAtTime(body * 0.65, t + dur);
  const og = c.createGain();
  og.gain.setValueAtTime(level * 0.5, t);
  og.gain.exponentialRampToValueAtTime(0.0001, t + dur * 1.3);
  osc.connect(og);
  og.connect(c.destination);
  osc.start(t);
  osc.stop(t + dur * 1.5 + 0.02);
}

/** Ensure the context exists/resumes — call on first user gesture. */
export function primeAudio() {
  ac();
}

/** Hover: a light, high, quick woody tick. */
export function playHover() {
  knock({ level: 0.07, dur: 0.035, tone: 900, q: 8, body: 420, click: 0.4 });
}

/** Click: a fuller, lower, satisfying woody knock. */
export function playSelect() {
  knock({ level: 0.2, dur: 0.1, tone: 430, q: 6, body: 175, click: 0.8 });
}

/** Scroll detent: the same light woody tick as hover, a touch quieter since it repeats. */
export function playScroll() {
  knock({ level: 0.05, dur: 0.035, tone: 900, q: 8, body: 420, click: 0.4 });
}
