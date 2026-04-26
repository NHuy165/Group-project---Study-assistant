// src/components/theme/elements/SkyEffects.jsx
import React, { useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════════
   MÂY TRÔI ĐỘNG  (ban ngày – nhẹ nhàng)
═══════════════════════════════════════════════════════════════════ */
export const DriftingClouds = ({ darkened }) => {
  // Dùng useMemo để không phải random lại vị trí mây mỗi khi component re-render
  const clouds = useMemo(() => [
    { top: "6%",  size: 220, opacity: darkened ? 0.55 : 0.18, dur: "55s",  anim: "cloud-drift-1", delay: "-10s" },
    { top: "11%", size: 160, opacity: darkened ? 0.65 : 0.22, dur: "72s",  anim: "cloud-drift-2", delay: "-30s" },
    { top: "4%",  size: 190, opacity: darkened ? 0.50 : 0.15, dur: "90s",  anim: "cloud-drift-3", delay: "-55s" },
    { top: "16%", size: 130, opacity: darkened ? 0.70 : 0.20, dur: "65s",  anim: "cloud-drift-1", delay: "-42s" },
  ], [darkened]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 4 }}>
      {clouds.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: c.top,
            left: "-25%",
            width: c.size,
            height: c.size * 0.55,
            borderRadius: "50%",
            background: darkened
              ? "radial-gradient(ellipse, rgba(60,80,120,0.9) 30%, transparent 75%)"
              : "radial-gradient(ellipse, rgba(255,255,255,0.95) 30%, transparent 75%)",
            opacity: c.opacity,
            filter: "blur(14px)",
            animation: `${c.anim} ${c.dur} linear infinite`,
            animationDelay: c.delay,
          }}
        />
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   SƯƠNG MÙ SÁNG SỚM  (trước khi mưa / sau mưa)
═══════════════════════════════════════════════════════════════════ */
export const MorningFog = ({ visible }) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      zIndex: 2,
      opacity: visible ? 1 : 0,
      transition: "opacity 4s ease",
    }}
  >
    {[0, 1, 2].map(i => (
      <div
        key={i}
        style={{
          position: "absolute",
          bottom: `${12 + i * 9}%`,
          left: "-10%",
          right: "-10%",
          height: `${55 - i * 12}px`,
          background: `radial-gradient(ellipse 80% 100% at 50% 50%,
            rgba(220,235,255,${0.38 - i * 0.08}) 0%,
            transparent 70%)`,
          filter: `blur(${12 + i * 6}px)`,
          animation: `fog-drift ${18 + i * 7}s ease-in-out infinite`,
          animationDelay: `${i * 3.5}s`,
          transformOrigin: "center",
        }}
      />
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   SAO ĐÊM NHẤP NHÁY
═══════════════════════════════════════════════════════════════════ */
export const StarField = ({ visible }) => {
  const stars = useMemo(() =>
    Array.from({ length: 90 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 55, // Sao chỉ tập trung ở nửa trên bầu trời
      size: 0.8 + Math.random() * 1.6,
      baseOp: 0.4 + Math.random() * 0.5,
      dur: `${2 + Math.random() * 4}s`,
      delay: `${Math.random() * 5}s`,
    }))
  , []);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1, opacity: visible ? 1 : 0, transition: "opacity 2s ease" }}
    >
      {stars.map(s => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#fff",
            "--base-op": s.baseOp,
            opacity: s.baseOp,
            animation: `twinkle ${s.dur} ease-in-out infinite`,
            animationDelay: s.delay,
            boxShadow: `0 0 ${s.size * 2}px rgba(255,255,255,0.6)`,
          }}
        />
      ))}
    </div>
  );
};