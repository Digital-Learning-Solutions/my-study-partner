// src/components/SponsorsStrip.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * SponsorsStrip
 * - No global CSS changes
 * - Uses Tailwind utility classes + inline styles only
 * - Auto-scrolls on desktop using JS (no keyframes)
 * - Duplicate logos for seamless looping
 * - Pauses on hover/focus, respects prefers-reduced-motion
 */
export default function SponsorsStrip({ logos }) {
  // default placeholder logos (keeps same look as before)
  const defaultLogos = ["A", "B", "C", "D", "E", "F"].map((s) => ({
    id: s,
    src: `https://placehold.co/200x100/e2e8f0/a0aec0?text=Sponsor+${s}`,
    alt: `Sponsor ${s}`,
  }));

  const items = logos && logos.length ? logos : defaultLogos;

  // duplicate for seamless marquee
  const trackItems = [...items, ...items];

  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // detect reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = () => setPrefersReducedMotion(mq.matches);
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;
    if (prefersReducedMotion) return; // don't animate if user prefers reduced motion

    let rafId = null;
    let lastTime = performance.now();
    const speedPxPerSec = 60; // tweak: pixels per second
    const step = (now) => {
      if (isPaused) {
        lastTime = now;
        rafId = requestAnimationFrame(step);
        return;
      }
      const dt = now - lastTime;
      lastTime = now;
      const dx = (speedPxPerSec * dt) / 1000;
      // scroll the container to the right (we move left visually)
      container.scrollLeft = container.scrollLeft + dx;

      // when scrolled past half (we duplicated items), reset to start for seamless loop
      // track.scrollWidth is double of single set; reset when scrolled >= half width
      const singleWidth = track.scrollWidth / 2;
      if (container.scrollLeft >= singleWidth) {
        container.scrollLeft = container.scrollLeft - singleWidth;
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    animRef.current = rafId;
    return () => cancelAnimationFrame(rafId);
  }, [isPaused, prefersReducedMotion]);

  // Pause on hover / focus
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  const handleFocusIn = () => setIsPaused(true);
  const handleFocusOut = () => setIsPaused(false);

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-900" aria-label="Sponsors">
      <div className="section-container">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Our Partners</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Trusted by institutions & companies</p>
        </div>

        {/* Desktop marquee (hidden on small screens) */}
        <div
          className="hidden md:block relative"
          // container that moves (we control scrollLeft on this element)
        >
          {/* fade overlays (visual only) */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-16 z-20"
            style={{
              background: "linear-gradient(90deg, rgba(255,255,255,1), rgba(255,255,255,0))",
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-16 z-20"
            style={{
              background: "linear-gradient(270deg, rgba(255,255,255,1), rgba(255,255,255,0))",
            }}
            aria-hidden="true"
          />

          {/* marquee scrolling container */}
          <div
            ref={containerRef}
            className="overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocusIn}
            onBlur={handleFocusOut}
            tabIndex={0} // focusable for keyboard users so they can pause
            aria-label="Sponsor logos"
            style={{ outline: "none" }}
          >
            <div
              ref={trackRef}
              className="flex items-center gap-12"
              style={{
                // ensure inline-flex width so duplicates behave consistently
                width: "max-content",
                // Make sure no wrapping
                whiteSpace: "nowrap",
              }}
            >
              {trackItems.map((logo, idx) => (
                <div key={`${logo.id}-${idx}`} className="flex-shrink-0">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    loading="lazy"
                    width="200"
                    height="100"
                    className="h-10 object-contain grayscale opacity-80 dark:opacity-60"
                    style={{ display: "block" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile grid fallback (no animation) */}
        <div className="grid grid-cols-3 gap-6 md:hidden">
          {items.map((logo, idx) => (
            <div key={logo.id} className="flex items-center justify-center">
              <img
                src={logo.src}
                alt={logo.alt}
                loading="lazy"
                className="h-10 object-contain grayscale opacity-80 dark:opacity-60"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
