"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { colors, t, type } from "../theme";
import { playHover, playScroll } from "../lib/sound";

/** Fraction (0–1) across the "waking day" window 9:00 AM → 2:00 AM (next day), IST. */
function scheduleFractionIST(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(date);
  const get = (k: string) => Number(parts.find((p) => p.type === k)?.value ?? 0);
  let h = get("hour");
  if (h === 24) h = 0;
  let m = h * 60 + get("minute");
  if (m < 120) m += 1440; // wrap post-midnight into the night tail
  const f = (m - 540) / (1560 - 540); // 9:00 → 2:00 next day
  return Math.min(1, Math.max(0, f));
}

type Card = { rotate: number; render: React.ReactNode };

/* Styled placeholder previews that echo the reference polaroids. */
const cards: Card[] = [
  {
    rotate: -6,
    render: (
      <div className="relative h-full w-full bg-[#f3f1fb]">
        <div className="absolute left-1 top-1 h-3 w-4 rounded-[1px] bg-[#d6cdf7]" />
        <div className="absolute right-1 top-1 h-3 w-4 rounded-[1px] bg-[#cabff2]" />
        <div className="absolute left-1/2 top-1 h-6 w-px -translate-x-1/2 bg-[#7c5cff]" />
        <div className="absolute bottom-1 left-2 h-0 w-0 border-l-[6px] border-l-black border-t-[8px] border-t-transparent border-b-[2px] border-b-transparent rotate-[15deg]" />
      </div>
    ),
  },
  {
    rotate: 3,
    render: (
      <div className="relative h-full w-full bg-white">
        <div className="absolute left-1 top-1 text-[5px] font-semibold text-[#7c5cff]">
          ✦ App/Buttons
        </div>
        <div className="absolute inset-x-1 top-4 bottom-1 rounded-[2px] border border-dashed border-[#c4b7f5]" />
        <div className="absolute bottom-2 left-1/2 h-4 w-6 -translate-x-1/2 rounded-[2px] bg-[#6d4dff]" />
      </div>
    ),
  },
  {
    rotate: -3,
    render: (
      <div className="relative h-full w-full bg-[#161616]">
        <div className="absolute inset-x-1 top-1 h-1 rounded-full bg-[#333]" />
        <div className="absolute left-1 top-3 flex items-end gap-[2px]">
          {[5, 9, 6, 11, 7, 10].map((h, i) => (
            <div
              key={i}
              style={{ height: h, backgroundColor: colors.accent }}
              className="w-[2px] rounded-full"
            />
          ))}
        </div>
        <div className="absolute bottom-1 left-1 h-1.5 w-1.5 rounded-full bg-white" />
        <div className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-[#333]" />
      </div>
    ),
  },
  {
    rotate: 5,
    render: (
      <div className="h-full w-full bg-gradient-to-br from-[#4b5563] via-[#374151] to-[#111827]" />
    ),
  },
  {
    rotate: -4,
    render: (
      <div className="h-full w-full bg-gradient-to-t from-[#f97316] via-[#fb923c] to-[#334155]" />
    ),
  },
];

// horizontal center of each card, as a % across the panel
const centers = cards.map((_, i) => 12 + (i * (88 - 12)) / (cards.length - 1));

export default function TimelineWidget() {
  const [now, setNow] = useState<Date | null>(null);
  const [pinPct, setPinPct] = useState(90);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const lastCardRef = useRef(-1);

  // index of the card whose center is nearest a given % position
  const nearestCard = (pct: number) => {
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < centers.length; i++) {
      const d = Math.abs(centers[i] - pct);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    return best;
  };

  // live clock → drives the resting pin position
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  const restPct = now ? scheduleFractionIST(now) * 100 : 90;

  useEffect(() => {
    if (!dragging) setPinPct(restPct);
  }, [restPct, dragging]);

  const pctFromEvent = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    return Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100));
  }, []);

  const onPinDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setDragging(true);
      const p = pctFromEvent(e.clientX);
      setPinPct(p);
      lastCardRef.current = nearestCard(p);
      playHover(); // soft "grab" tick
    },
    [pctFromEvent],
  );

  const onPinMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const p = pctFromEvent(e.clientX);
      setPinPct(p);
      // detent tick each time the playhead crosses onto a new card
      const card = nearestCard(p);
      if (card !== lastCardRef.current) {
        lastCardRef.current = card;
        playScroll();
      }
    },
    [dragging, pctFromEvent],
  );

  const onPinUp = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    setDragging(false);
  }, []);

  // per-card scale based on distance from the pin (only while dragging)
  const cardState = (i: number) => {
    const dist = Math.abs(centers[i] - pinPct);
    const boost = dragging ? Math.max(0, 1 - dist / 16) : 0;
    return {
      scale: 1 + 0.34 * boost,
      translateY: -14 * boost,
      rotate: cards[i].rotate * (1 - boost),
      zIndex: boost > 0.4 ? 30 : 10 + i,
    };
  };

  return (
    <div className={`w-[330px] max-w-full select-none ${dragging ? "cursor-grabbing" : ""}`}>
      {/* location + timezone */}
      <div
        className="mb-1.5 flex items-center justify-between"
        style={t(type.location)}
      >
        <span className="flex items-center gap-1.5">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            {/* navigation / location arrow, pointing up-left */}
            <path d="M21 11 2 2l9 19 2-8 8-2Z" />
          </svg>
          Bengaluru
        </span>
        <span>GMT+05:30</span>
      </div>

      {/* time axis + pin dot (above the panel) */}
      <div className="relative mb-2 h-[15px]" style={t(type.axis)}>
        <span className="absolute left-0 top-0">9:00 AM</span>
        <span className="absolute left-1/2 top-0 -translate-x-1/2">6:30 PM</span>
        <span className="absolute right-0 top-0">2:00 AM</span>
      </div>

      {/* card panel */}
      <div ref={trackRef} className="relative h-[80px]">
        <div
          className="grid-bg absolute inset-0 rounded-[6px] border"
          style={{ backgroundColor: colors.panel, borderColor: colors.line }}
        />

        {/* cards */}
        {cards.map((card, i) => {
          const s = cardState(i);
          return (
            <motion.div
              key={i}
              className="absolute top-1/2"
              style={{ left: `${centers[i]}%`, x: "-50%", y: "-50%" }}
              animate={{
                scale: s.scale,
                translateY: s.translateY,
                rotate: s.rotate,
                zIndex: s.zIndex,
              }}
              transition={{ type: "spring", stiffness: 340, damping: 26 }}
            >
              <div
                className="rounded-[4px] border px-[3px] pb-[7px] pt-[3px]"
                style={{ backgroundColor: colors.panel, borderColor: colors.line }}
              >
                <div className="h-[42px] w-[40px] overflow-hidden rounded-[2px]">
                  {card.render}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* draggable pin: dot above the panel + line through it */}
        <div
          className={`absolute -top-[14px] z-40 flex h-[94px] w-6 -translate-x-1/2 justify-center ${
            dragging ? "cursor-grabbing" : "cursor-grab"
          } ${dragging ? "" : "transition-[left] duration-500 ease-out"}`}
          style={{ left: `${pinPct}%`, touchAction: "none" }}
          onPointerDown={onPinDown}
          onPointerMove={onPinMove}
          onPointerUp={onPinUp}
          onPointerCancel={onPinUp}
        >
          <span
            className="pointer-events-none absolute top-0 h-[9px] w-[9px] rounded-full"
            style={{ backgroundColor: colors.accent }}
          />
          <span
            className="pointer-events-none h-full w-px"
            style={{ backgroundColor: colors.accent }}
          />
        </div>
      </div>
    </div>
  );
}
