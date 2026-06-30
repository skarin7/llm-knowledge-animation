import React from 'react'
import { useCurrentFrame, useVideoConfig } from 'remotion'
import { INK, GREEN, LGREEN, AMBER, LAMBER, FADE, VW, VH, HAND, HTITLE, MONO } from '../constants.js'

const FPS = 30

// ── Easing functions ────────────────────────────────────────────────────────
export const Easing = {
  linear: (t) => t,
  easeInQuad:    (t) => t * t,
  easeOutQuad:   (t) => t * (2 - t),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic:    (t) => t * t * t,
  easeOutCubic:   (t) => (--t) * t * t + 1,
  easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  easeInQuart:    (t) => t * t * t * t,
  easeOutQuart:   (t) => 1 - (--t) * t * t * t,
  easeInOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t),
  easeInExpo:  (t) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return 0.5 * Math.pow(2, 20 * t - 10);
    return 1 - 0.5 * Math.pow(2, -20 * t + 10);
  },
  easeInSine:    (t) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine:   (t) => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  easeOutBack: (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInBack: (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  easeInOutBack: (t) => {
    const c1 = 1.70158, c2 = c1 * 1.525;
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },
  easeOutElastic: (t) => {
    const c4 = (2 * Math.PI) / 3;
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

// ── Core helpers ─────────────────────────────────────────────────────────────
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export function interpolate(input, output, ease = Easing.linear) {
  return (t) => {
    if (t <= input[0]) return output[0];
    if (t >= input[input.length - 1]) return output[output.length - 1];
    for (let i = 0; i < input.length - 1; i++) {
      if (t >= input[i] && t <= input[i + 1]) {
        const span = input[i + 1] - input[i];
        const local = span === 0 ? 0 : (t - input[i]) / span;
        const easeFn = Array.isArray(ease) ? (ease[i] || Easing.linear) : ease;
        return output[i] + (output[i + 1] - output[i]) * easeFn(local);
      }
    }
    return output[output.length - 1];
  };
}

export function animate({ from = 0, to = 1, start = 0, end = 1, ease = Easing.easeInOutCubic }) {
  return (t) => {
    if (t <= start) return from;
    if (t >= end) return to;
    return from + (to - from) * ease((t - start) / (end - start));
  };
}

// ── Remotion-backed timeline ──────────────────────────────────────────────────
export const useTime = () => useCurrentFrame() / FPS;
export const useTimeline = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return { time: frame / FPS, duration: durationInFrames / FPS, playing: true, setTime: () => {}, setPlaying: () => {} };
};

// ── Sprite ───────────────────────────────────────────────────────────────────
export const SpriteContext = React.createContext({ localTime: 0, progress: 0, duration: 0 });
export const useSprite = () => React.useContext(SpriteContext);

export function Sprite({ start = 0, end = Infinity, children, keepMounted = false }) {
  const time = useTime();
  const visible = time >= start && (end === Infinity || time <= end);
  if (!visible && !keepMounted) return null;

  const duration = end - start;
  const localTime = Math.max(0, time - start);
  const progress = duration > 0 && isFinite(duration) ? clamp(localTime / duration, 0, 1) : 0;
  const value = { localTime, progress, duration, visible };

  return (
    <SpriteContext.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </SpriteContext.Provider>
  );
}

// ── Sample sprite components ─────────────────────────────────────────────────
export function TextSprite({
  text, x = 0, y = 0, size = 48, color = '#111',
  font = 'Inter, system-ui, sans-serif', weight = 600,
  entryDur = 0.45, exitDur = 0.35,
  entryEase = Easing.easeOutBack, exitEase = Easing.easeInCubic,
  align = 'left', letterSpacing = '-0.01em',
}) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - exitDur);
  let opacity = 1, ty = 0;
  if (localTime < entryDur) {
    const t = entryEase(clamp(localTime / entryDur, 0, 1));
    opacity = t; ty = (1 - t) * 16;
  } else if (localTime > exitStart) {
    const t = exitEase(clamp((localTime - exitStart) / exitDur, 0, 1));
    opacity = 1 - t; ty = -t * 8;
  }
  const translateX = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0';
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `translate(${translateX}, ${ty}px)`,
      opacity, fontFamily: font, fontSize: size, fontWeight: weight, color,
      letterSpacing, whiteSpace: 'pre', lineHeight: 1.1, willChange: 'transform, opacity',
    }}>{text}</div>
  );
}

export function ImageSprite({
  src, x = 0, y = 0, width = 400, height = 300,
  entryDur = 0.6, exitDur = 0.4,
  kenBurns = false, kenBurnsScale = 1.08, radius = 12, fit = 'cover', placeholder = null,
}) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - exitDur);
  let opacity = 1, scale = 1;
  if (localTime < entryDur) {
    const t = Easing.easeOutCubic(clamp(localTime / entryDur, 0, 1));
    opacity = t; scale = 0.96 + 0.04 * t;
  } else if (localTime > exitStart) {
    const t = Easing.easeInCubic(clamp((localTime - exitStart) / exitDur, 0, 1));
    opacity = 1 - t; scale = (kenBurns ? kenBurnsScale : 1) + 0.02 * t;
  } else if (kenBurns) {
    const holdSpan = exitStart - entryDur;
    scale = 1 + (kenBurnsScale - 1) * (holdSpan > 0 ? (localTime - entryDur) / holdSpan : 0);
  }
  const content = placeholder ? (
    <div style={{
      width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'repeating-linear-gradient(135deg, #e9e6df 0 10px, #dcd8cf 10px 20px)',
      color: '#6b6458', fontFamily: 'JetBrains Mono, ui-monospace, monospace',
      fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase',
    }}>{placeholder.label || 'image'}</div>
  ) : (
    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: fit, display: 'block' }} />
  );
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width, height,
      opacity, transform: `scale(${scale})`, transformOrigin: 'center',
      borderRadius: radius, overflow: 'hidden', willChange: 'transform, opacity',
    }}>{content}</div>
  );
}

export function RectSprite({
  x = 0, y = 0, width = 100, height = 100, color = '#111', radius = 8,
  entryDur = 0.4, exitDur = 0.3, render,
}) {
  const spriteCtx = useSprite();
  const { localTime, duration } = spriteCtx;
  const exitStart = Math.max(0, duration - exitDur);
  let opacity = 1, scale = 1;
  if (localTime < entryDur) {
    const t = Easing.easeOutBack(clamp(localTime / entryDur, 0, 1));
    opacity = clamp(localTime / entryDur, 0, 1); scale = 0.4 + 0.6 * t;
  } else if (localTime > exitStart) {
    const t = Easing.easeInQuad(clamp((localTime - exitStart) / exitDur, 0, 1));
    opacity = 1 - t; scale = 1 - 0.15 * t;
  }
  const overrides = render ? render(spriteCtx) : {};
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width, height,
      background: color, borderRadius: radius, opacity,
      transform: `scale(${scale})`, transformOrigin: 'center',
      willChange: 'transform, opacity', ...overrides,
    }} />
  );
}

// ── Stage (thin wrapper — playback handled by @remotion/player) ───────────────
export function Stage({ background = '#f6f4ef', children }) {
  return (
    <div style={{ width: '100%', height: '100%', background, position: 'relative', overflow: 'hidden' }}>
      {children}
    </div>
  );
}

// ── Scene primitives ─────────────────────────────────────────────────────────
export function SketchDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute', overflow: 'hidden', pointerEvents: 'none' }}>
      <defs>
        <filter id="rough" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.017" numOctaves="2" seed="7" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.8" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
    </svg>
  );
}

export function Paper() {
  return <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, rgba(42,47,43,0.11) 1.2px, transparent 1.2px)', backgroundSize: '34px 34px' }}/>;
}

export function Draw({ start, end, dur = 0.55, children }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime }) => children(clamp(localTime / dur, 0, 1), localTime)}
    </Sprite>
  );
}

export function Scene({ start, end, fade = 0.5, children }) {
  const t = useTime();
  if (t < start - 0.05 || t > end + 0.05) return null;
  const op = Math.min(
    Easing.easeOutCubic(clamp((t - start) / fade, 0, 1)),
    Easing.easeOutCubic(clamp((end - t) / fade, 0, 1))
  );
  return <div style={{ position: 'absolute', inset: 0, opacity: op }}>{children}</div>;
}

export function Label({ start, end, x = 0, y = 0, size = 24, color = INK, font = HAND, weight = 400, align = 'left', width: lw = 'auto', style, children }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const fin = isFinite(duration) ? duration : 9999;
        const inP = Easing.easeOutCubic(clamp(localTime / 0.36, 0, 1));
        const outP = Easing.easeInCubic(clamp((localTime - (fin - 0.36)) / 0.36, 0, 1));
        const op = Math.min(inP, 1 - outP);
        const ty = (1 - inP) * 11;
        return (
          <div style={{
            position: 'absolute', left: x, top: y, width: lw, opacity: op,
            transform: `translateY(${ty}px)`, fontFamily: font, fontSize: size,
            color, fontWeight: weight, textAlign: align, lineHeight: 1.35,
            whiteSpace: 'pre-line', pointerEvents: 'none', ...style,
          }}>{children}</div>
        );
      }}
    </Sprite>
  );
}

export function Box({ x, y, w, h, draw = 1, fill = 'none', stroke = INK, sw = 2.6, r = 13, children, childStyle, labelSize = 21 }) {
  const perim = 2 * (w + h);
  const offset = perim * (1 - clamp(draw, 0, 1));
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h }}>
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <rect x={sw+1} y={sw+1} width={w-2*(sw+1)} height={h-2*(sw+1)} rx={r} ry={r}
          fill={fill} stroke={stroke} strokeWidth={sw}
          strokeDasharray={perim} strokeDashoffset={offset}
          strokeLinecap="round" filter="url(#rough)"/>
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '8px 14px', textAlign: 'center', fontFamily: HAND, fontSize: labelSize,
        color: INK, lineHeight: 1.35, whiteSpace: 'pre-line', ...childStyle,
      }}>{children}</div>
    </div>
  );
}

export function Arrow({ x1, y1, x2, y2, cx, cy, draw = 1, color = INK, sw = 2.5 }) {
  const mx = cx !== undefined ? cx : (x1 + x2) / 2;
  const my = cy !== undefined ? cy : (y1 + y2) / 2;
  const path = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  const ang = Math.atan2(y2 - my, x2 - mx);
  const hl = 13, ha = 0.42;
  const h1 = `M ${x2} ${y2} L ${x2-hl*Math.cos(ang-ha)} ${y2-hl*Math.sin(ang-ha)}`;
  const h2 = `M ${x2} ${y2} L ${x2-hl*Math.cos(ang+ha)} ${y2-hl*Math.sin(ang+ha)}`;
  const hOp = clamp((draw - 0.80) / 0.20, 0, 1);
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: VW, height: VH, overflow: 'visible', pointerEvents: 'none' }}>
      <path d={path} fill="none" stroke={color} strokeWidth={sw} pathLength="1" strokeDasharray="1" strokeDashoffset={1-clamp(draw,0,1)} strokeLinecap="round" filter="url(#rough)"/>
      <g opacity={hOp}>
        <path d={h1} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" filter="url(#rough)"/>
        <path d={h2} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" filter="url(#rough)"/>
      </g>
    </svg>
  );
}

export function Squiggle({ x, y, len, draw = 1, color = GREEN, sw = 4 }) {
  const d = `M ${x} ${y} Q ${x+len*0.25} ${y+7} ${x+len*0.5} ${y} Q ${x+len*0.75} ${y-7} ${x+len} ${y}`;
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: VW, height: VH, overflow: 'visible', pointerEvents: 'none' }}>
      <path d={d} fill="none" stroke={color} strokeWidth={sw} pathLength="1" strokeDasharray="1" strokeDashoffset={1-clamp(draw,0,1)} strokeLinecap="round" filter="url(#rough)"/>
    </svg>
  );
}

export function LogitBar({ x, y, label, barMaxW = 196, score, prob, color = GREEN, draw = 1 }) {
  const w = barMaxW * clamp(draw, 0, 1);
  return (
    <div style={{ position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 7 }}>
      <div style={{ width: 60, fontFamily: HAND, fontSize: 18, color: INK, textAlign: 'right', flexShrink: 0 }}>{label}</div>
      <div style={{ width: barMaxW, height: 24, background: 'rgba(42,47,43,0.07)', borderRadius: 4, overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ width: w, height: '100%', background: color, borderRadius: 4 }}/>
      </div>
      <div style={{ fontFamily: MONO, fontSize: 14, color: FADE, width: 30 }}>{score}</div>
      <div style={{ fontFamily: HAND, fontSize: 17, color, fontWeight: 600, width: 42 }}>{prob}</div>
    </div>
  );
}

export function TopBar({ start, end, stageEnds }) {
  const t = useTime();
  if (t < start || t > end) return null;
  const op = Math.min(
    Easing.easeOutCubic(clamp((t - start) / 0.5, 0, 1)),
    Easing.easeOutCubic(clamp((end - t) / 0.5, 0, 1))
  );
  const active = stageEnds.findIndex(e => t < e);
  const stages = ['① Pre-training', '② SFT', '③ RL + HF', '④ Inference'];
  const cols = [GREEN, AMBER, INK, GREEN];
  return (
    <div style={{ position: 'absolute', top: 6, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: op, pointerEvents: 'none', zIndex: 10 }}>
      <div style={{ display: 'flex', gap: 4, background: 'rgba(245,242,232,0.93)', border: '1.5px solid rgba(42,47,43,0.25)', borderRadius: 28, padding: '3px 8px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        {stages.map((s, i) => (
          <div key={i} style={{ fontFamily: HAND, fontSize: 14, padding: '2px 10px', borderRadius: 20, background: i === active ? cols[i] : 'transparent', color: i === active ? '#fff' : FADE, fontWeight: i === active ? 600 : 400 }}>{s}</div>
        ))}
      </div>
    </div>
  );
}
