import type { CSSProperties } from "react";

// Hardcoded configs (no randomness) so server and client markup match — avoids
// React hydration warnings. Negative delays start each bed partway up so the
// screen is already populated on first paint.
const BEDS: Array<{
  left: number; // vw
  size: number; // rem
  duration: number; // s
  delay: number; // s (negative)
  drift: number; // px horizontal drift
  spin: number; // deg
  opacity: number;
}> = [
  { left: 6, size: 2.0, duration: 30, delay: -4, drift: 40, spin: 12, opacity: 0.22 },
  { left: 15, size: 1.4, duration: 38, delay: -20, drift: -30, spin: -10, opacity: 0.16 },
  { left: 24, size: 2.6, duration: 26, delay: -12, drift: 55, spin: 18, opacity: 0.24 },
  { left: 33, size: 1.6, duration: 34, delay: -28, drift: -20, spin: -14, opacity: 0.18 },
  { left: 42, size: 2.2, duration: 29, delay: -8, drift: 35, spin: 10, opacity: 0.2 },
  { left: 51, size: 1.3, duration: 40, delay: -16, drift: -45, spin: -8, opacity: 0.15 },
  { left: 60, size: 2.8, duration: 24, delay: -22, drift: 50, spin: 16, opacity: 0.24 },
  { left: 69, size: 1.7, duration: 36, delay: -6, drift: -25, spin: -12, opacity: 0.18 },
  { left: 78, size: 2.1, duration: 31, delay: -18, drift: 40, spin: 14, opacity: 0.21 },
  { left: 86, size: 1.5, duration: 39, delay: -10, drift: -35, spin: -9, opacity: 0.16 },
  { left: 93, size: 2.4, duration: 27, delay: -25, drift: 30, spin: 13, opacity: 0.22 },
  { left: 40, size: 1.4, duration: 33, delay: -32, drift: 60, spin: -16, opacity: 0.15 },
];

export default function FloatingBeds() {
  return (
    <div className="floating-beds" aria-hidden="true">
      {BEDS.map((b, i) => (
        <span
          key={i}
          className="floating-bed"
          style={
            {
              left: `${b.left}vw`,
              fontSize: `${b.size}rem`,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              "--bed-drift": `${b.drift}px`,
              "--bed-spin": `${b.spin}deg`,
              "--bed-opacity": b.opacity,
            } as CSSProperties
          }
        >
          🛏️
        </span>
      ))}
    </div>
  );
}
