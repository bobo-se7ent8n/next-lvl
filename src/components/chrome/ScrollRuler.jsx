import { useEffect, useMemo, useState } from "react";

import { PATTERNS } from "../../data/mock";
import { useScrollProgress } from "../../lib/scrollProgress";

/* ============================================================
   TOP SCROLL RULER

   A measurement strip pinned to the very top edge of the viewport.
   Fine ticks run the full width; every step gets a taller tick and
   a number, and those numbers are pattern indices — 1 through the
   size of the pattern set — so the ruler reads as a position in the
   data rather than as decoration.

   A badge rides along it at the current scroll fraction. It sits
   above the background layers and below modal overlays.
   ============================================================ */

const TOTAL = PATTERNS.length;
const FINE_PER_STEP = 5; // fine ticks between two labelled ticks

export function ScrollRuler() {
  const { progress, claimed } = useScrollProgress();
  const [windowProgress, setWindowProgress] = useState(0);

  // no screen has claimed the ruler → measure the window instead
  useEffect(() => {
    if (claimed) return;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setWindowProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [claimed]);

  const p = claimed ? progress : windowProgress;
  const pct = Math.round(p * 100);

  const ticks = useMemo(
    () =>
      Array.from({ length: TOTAL * FINE_PER_STEP + 1 }, (_, i) => {
        const major = i % FINE_PER_STEP === 0;
        return {
          at: (i / (TOTAL * FINE_PER_STEP)) * 100,
          major,
          label: major ? i / FINE_PER_STEP : null,
        };
      }),
    [],
  );

  return (
    <div
      className="fixed inset-x-0 top-0 z-30 h-[var(--ruler-h)] select-none bg-canvas/90 backdrop-blur-sm"
      role="presentation"
    >
      {/* the measured strip stops short of the live indicator so the
          last labels never collide with it */}
      <div className="relative h-full overflow-hidden pr-[150px]">
        <div className="relative h-full w-full">
          {ticks.map((t, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="absolute top-0 block w-px bg-ink"
              style={{
                left: `${t.at}%`,
                height: t.major ? 9 : 4,
                opacity: t.major ? 0.4 : 0.18,
              }}
            />
          ))}

          {ticks
            .filter((t) => t.label != null && t.label > 0)
            .map((t) => (
              <span
                key={`l-${t.label}`}
                aria-hidden="true"
                className="num absolute top-[10px] -translate-x-1/2 text-[8px] font-semibold leading-none text-ink3"
                style={{ left: `${t.at}%` }}
              >
                {t.label}
              </span>
            ))}

          {/* the badge rides the strip at the current scroll fraction */}
          <span
            className="num absolute top-[4px] rounded-pill bg-select px-[7px] py-[2px] text-[9px] font-semibold leading-none text-white transition-[left] duration-150 ease-out"
            style={{
              left: `clamp(22px, ${p * 100}%, calc(100% - 22px))`,
              transform: "translateX(-50%)",
            }}
          >
            {pct}%
          </span>
        </div>
      </div>

      {/* live indicator */}
      <span className="absolute right-md top-1/2 flex -translate-y-1/2 items-center gap-[5px]">
        <i
          aria-hidden="true"
          className="block h-[6px] w-[6px] rounded-pill bg-select"
        />
        <span className="text-[9px] font-medium uppercase tracking-label text-ink3">
          live · {TOTAL} patterns
        </span>
      </span>
    </div>
  );
}
