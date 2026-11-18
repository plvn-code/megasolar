/**
 * MEGASOLAR mark, redrawn as SVG from the client's logo: a leaf, the rising sun with rays,
 * a field of panels and furrows. Wordmark in Montserrat ExtraBold like the original.
 */
export function Mark({ className = "", size = 40, id = "mk" }: { className?: string; size?: number; id?: string }) {
  const rays = Array.from({ length: 11 }, (_, i) => {
    const a = Math.PI + (i * Math.PI) / 10;
    const r1 = 12.5;
    const r2 = i % 2 ? 17 : 19.5;
    return `M${(34 + Math.cos(a) * r1).toFixed(1)} ${(22 + Math.sin(a) * r1).toFixed(1)}L${(34 + Math.cos(a) * r2).toFixed(1)} ${(22 + Math.sin(a) * r2).toFixed(1)}`;
  }).join("");
  return (
    <svg className={`mark ${className}`} width={size} height={(size * 52) / 64} viewBox="0 0 64 52" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}Sun`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe36e" />
          <stop offset="1" stopColor="#f6b928" />
        </linearGradient>
        <linearGradient id={`${id}Leaf`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b6e04a" />
          <stop offset="1" stopColor="#4f9a2f" />
        </linearGradient>
        <linearGradient id={`${id}Panel`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6fe0cf" />
          <stop offset="1" stopColor="#2a9c90" />
        </linearGradient>
      </defs>
      <path className="mark-rays" d={rays} stroke="#e8d86a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path className="mark-sun" d="M24 22a10 10 0 0 1 20 0Z" fill={`url(#${id}Sun)`} />
      <path className="mark-leaf" d="M7 25C4 15 8 7 15 3c3 8 2 16-3 22Z" fill={`url(#${id}Leaf)`} />
      <path d="M9.5 23.5c1.6-6 3.4-11 5.2-17" stroke="#0b1710" strokeOpacity="0.55" strokeWidth="1" fill="none" />
      <path className="mark-panel" d="M12 25.5 47 23l9 10.5L18 38Z" fill={`url(#${id}Panel)`} />
      <path d="M15.2 29.8 51.3 27.4M17 33.9l36.6-2.6M23.5 25.1l4.4 12.1M32.3 24.4l5.3 12.1M40.4 23.8l6.2 11.9" stroke="#07120b" strokeWidth="1.1" fill="none" />
      <path className="mark-field" d="M4 41l20-2.4M2 46l28-3.3M30 47.5l30-14M40 48l22-9.5M51 48l11-4.6" stroke="#5fae3c" strokeWidth="2.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Logo({ sub = true, className = "", id = "lg" }: { sub?: boolean; className?: string; id?: string }) {
  return (
    <span className={`logo ${className}`} aria-hidden="true">
      <Mark id={id} />
      <span className="logo-text">
        <span className="logo-word">
          MEGA<b>SOLAR</b>
        </span>
        {sub && <span className="logo-sub">сонячна енергетика · Полтава</span>}
      </span>
    </span>
  );
}
