// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// animations.jsx
// Reusable animation starter: Stage, Timeline, Sprite, easing helpers.
// Exports (to window): Stage, Sprite, PlaybackBar, TextSprite, ImageSprite, RectSprite,
//   useTime, useTimeline, useSprite, Easing, interpolate, animate, clamp.
//
// Usage (in an HTML file that loads React + Babel):
//
//   <Stage width={1280} height={720} duration={10} background="#f6f4ef">
//     <MyScene />
//   </Stage>
//
// <Stage> auto-scales to the viewport and provides the scrubber, play/pause,
// ←/→ seek, space, and 0-to-reset controls, and persists the playhead.
// Inside <Stage>, any child can call useTime() to read the current
// playhead (seconds). Or wrap content in <Sprite start={1} end={4}>...</Sprite>
// to only render during that window -- children receive a `localTime` and
// `progress` via the useSprite() hook. Use Easing + interpolate()/animate()
// for tweens; TextSprite / ImageSprite / RectSprite have built-in entry/exit.
// Build YOUR scenes by composing Sprites inside a Stage.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

// ── Easing functions (hand-rolled, Popmotion-style) ─────────────────────────
// All easings take t ∈ [0,1] and return eased t ∈ [0,1] (may overshoot for back/elastic).
const Easing = {
  linear: (t) => t,

  // Quad
  easeInQuad:    (t) => t * t,
  easeOutQuad:   (t) => t * (2 - t),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

  // Cubic
  easeInCubic:    (t) => t * t * t,
  easeOutCubic:   (t) => (--t) * t * t + 1,
  easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),

  // Quart
  easeInQuart:    (t) => t * t * t * t,
  easeOutQuart:   (t) => 1 - (--t) * t * t * t,
  easeInOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t),

  // Expo
  easeInExpo:  (t) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return 0.5 * Math.pow(2, 20 * t - 10);
    return 1 - 0.5 * Math.pow(2, -20 * t + 10);
  },

  // Sine
  easeInSine:    (t) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine:   (t) => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,

  // Back (overshoot)
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

  // Elastic
  easeOutElastic: (t) => {
    const c4 = (2 * Math.PI) / 3;
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

// ── Core interpolation helpers ──────────────────────────────────────────────

// Clamp a value to [min, max]
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// interpolate([0, 0.5, 1], [0, 100, 50], ease?) -> fn(t)
// Popmotion-style: linearly maps t across input keyframes to output values,
// with optional easing per segment (single fn or array of fns).
function interpolate(input, output, ease = Easing.linear) {
  return (t) => {
    if (t <= input[0]) return output[0];
    if (t >= input[input.length - 1]) return output[output.length - 1];
    for (let i = 0; i < input.length - 1; i++) {
      if (t >= input[i] && t <= input[i + 1]) {
        const span = input[i + 1] - input[i];
        const local = span === 0 ? 0 : (t - input[i]) / span;
        const easeFn = Array.isArray(ease) ? (ease[i] || Easing.linear) : ease;
        const eased = easeFn(local);
        return output[i] + (output[i + 1] - output[i]) * eased;
      }
    }
    return output[output.length - 1];
  };
}

// animate({from, to, start, end, ease})(t) — simpler single-segment tween.
// Returns `from` before `start`, `to` after `end`.
function animate({ from = 0, to = 1, start = 0, end = 1, ease = Easing.easeInOutCubic }) {
  return (t) => {
    if (t <= start) return from;
    if (t >= end) return to;
    const local = (t - start) / (end - start);
    return from + (to - from) * ease(local);
  };
}

// ── Timeline context ────────────────────────────────────────────────────────

const TimelineContext = React.createContext({ time: 0, duration: 10, playing: false });

const useTime = () => React.useContext(TimelineContext).time;
const useTimeline = () => React.useContext(TimelineContext);

// ── Sprite ──────────────────────────────────────────────────────────────────
// Renders children only when the playhead is inside [start, end]. Provides
// a sub-context with `localTime` (seconds since start) and `progress` (0..1).
//
//   <Sprite start={2} end={5}>
//     {({ localTime, progress }) => <Thing x={progress * 100} />}
//   </Sprite>
//
// Or as a plain wrapper — children can call useSprite() themselves.

const SpriteContext = React.createContext({ localTime: 0, progress: 0, duration: 0 });
const useSprite = () => React.useContext(SpriteContext);

function Sprite({ start = 0, end = Infinity, children, keepMounted = false }) {
  const { time } = useTimeline();
  const visible = time >= start && time <= end;
  if (!visible && !keepMounted) return null;

  const duration = end - start;
  const localTime = Math.max(0, time - start);
  const progress = duration > 0 && isFinite(duration)
    ? clamp(localTime / duration, 0, 1)
    : 0;

  const value = { localTime, progress, duration, visible };

  return (
    <SpriteContext.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </SpriteContext.Provider>
  );
}

// ── Sample sprite components ────────────────────────────────────────────────

// TextSprite: fades/slides text in on entry, holds, then fades out on exit.
// Props: text, x, y, size, color, font, entryDur, exitDur, align
function TextSprite({
  text,
  x = 0, y = 0,
  size = 48,
  color = '#111',
  font = 'Inter, system-ui, sans-serif',
  weight = 600,
  entryDur = 0.45,
  exitDur = 0.35,
  entryEase = Easing.easeOutBack,
  exitEase = Easing.easeInCubic,
  align = 'left',
  letterSpacing = '-0.01em',
}) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - exitDur);

  let opacity = 1;
  let ty = 0;

  if (localTime < entryDur) {
    const t = entryEase(clamp(localTime / entryDur, 0, 1));
    opacity = t;
    ty = (1 - t) * 16;
  } else if (localTime > exitStart) {
    const t = exitEase(clamp((localTime - exitStart) / exitDur, 0, 1));
    opacity = 1 - t;
    ty = -t * 8;
  }

  const translateX = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0';

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      transform: `translate(${translateX}, ${ty}px)`,
      opacity,
      fontFamily: font,
      fontSize: size,
      fontWeight: weight,
      color,
      letterSpacing,
      whiteSpace: 'pre',
      lineHeight: 1.1,
      willChange: 'transform, opacity',
    }}>
      {text}
    </div>
  );
}

// ImageSprite: scales + fades in; optional Ken Burns drift during hold.
function ImageSprite({
  src,
  x = 0, y = 0,
  width = 400, height = 300,
  entryDur = 0.6,
  exitDur = 0.4,
  kenBurns = false,
  kenBurnsScale = 1.08,
  radius = 12,
  fit = 'cover',
  placeholder = null, // {label: string} for striped placeholder
}) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - exitDur);

  let opacity = 1;
  let scale = 1;

  if (localTime < entryDur) {
    const t = Easing.easeOutCubic(clamp(localTime / entryDur, 0, 1));
    opacity = t;
    scale = 0.96 + 0.04 * t;
  } else if (localTime > exitStart) {
    const t = Easing.easeInCubic(clamp((localTime - exitStart) / exitDur, 0, 1));
    opacity = 1 - t;
    scale = (kenBurns ? kenBurnsScale : 1) + 0.02 * t;
  } else if (kenBurns) {
    const holdSpan = exitStart - entryDur;
    const holdT = holdSpan > 0 ? (localTime - entryDur) / holdSpan : 0;
    scale = 1 + (kenBurnsScale - 1) * holdT;
  }

  const content = placeholder ? (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'repeating-linear-gradient(135deg, #e9e6df 0 10px, #dcd8cf 10px 20px)',
      color: '#6b6458',
      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
      fontSize: 13,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
    }}>
      {placeholder.label || 'image'}
    </div>
  ) : (
    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: fit, display: 'block' }} />
  );

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      width, height,
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: 'center',
      borderRadius: radius,
      overflow: 'hidden',
      willChange: 'transform, opacity',
    }}>
      {content}
    </div>
  );
}

// RectSprite: simple rectangle that animates position/size/color via props.
// Useful demo primitive — takes a `render` fn for per-frame customization.
function RectSprite({
  x = 0, y = 0,
  width = 100, height = 100,
  color = '#111',
  radius = 8,
  entryDur = 0.4,
  exitDur = 0.3,
  render, // optional: (ctx) => style overrides
}) {
  const spriteCtx = useSprite();
  const { localTime, duration } = spriteCtx;
  const exitStart = Math.max(0, duration - exitDur);

  let opacity = 1;
  let scale = 1;

  if (localTime < entryDur) {
    const t = Easing.easeOutBack(clamp(localTime / entryDur, 0, 1));
    opacity = clamp(localTime / entryDur, 0, 1);
    scale = 0.4 + 0.6 * t;
  } else if (localTime > exitStart) {
    const t = Easing.easeInQuad(clamp((localTime - exitStart) / exitDur, 0, 1));
    opacity = 1 - t;
    scale = 1 - 0.15 * t;
  }

  const overrides = render ? render(spriteCtx) : {};

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      width, height,
      background: color,
      borderRadius: radius,
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: 'center',
      willChange: 'transform, opacity',
      ...overrides,
    }} />
  );
}


function Stage({
  width = 1280,
  height = 720,
  duration = 10,
  background = '#f6f4ef',
  fps = 60,
  loop = true,
  autoplay = true,
  persistKey = 'animstage',
  children,
}) {
  const [time, setTime] = React.useState(() => {
    try {
      const v = parseFloat(localStorage.getItem(persistKey + ':t') || '0');
      return isFinite(v) ? clamp(v, 0, duration) : 0;
    } catch { return 0; }
  });
  const [playing, setPlaying] = React.useState(autoplay);
  const [hoverTime, setHoverTime] = React.useState(null);
  const [scale, setScale] = React.useState(1);

  const stageRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const lastTsRef = React.useRef(null);
  const timeRef = React.useRef(time);
  React.useEffect(() => { timeRef.current = time; }, [time]);

  // Persist playhead
  React.useEffect(() => {
    try { localStorage.setItem(persistKey + ':t', String(time)); } catch {}
  }, [time, persistKey]);

  // Auto-scale to fit viewport
  React.useEffect(() => {
    if (!stageRef.current) return;
    const el = stageRef.current;
    const measure = () => {
      const barH = 44; // playback bar height
      const s = Math.min(
        el.clientWidth / width,
        (el.clientHeight - barH) / height
      );
      setScale(Math.max(0.05, s));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [width, height]);

  // Animation loop
  React.useEffect(() => {
    if (!playing) {
      lastTsRef.current = null;
      return;
    }
    const step = (ts) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setTime((t) => {
        let next = t + dt;
        if (next >= duration) {
          if (loop) next = next % duration;
          else { next = duration; setPlaying(false); }
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [playing, duration, loop]);

  // Keyboard: space = play/pause, ← → = seek
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (timeRef.current >= duration - 0.5) {
          setTime(0); setPlaying(true);
        } else { setPlaying(p => !p); }
      } else if (e.code === 'ArrowLeft') {
        setTime(t => clamp(t - (e.shiftKey ? 1 : 0.1), 0, duration));
      } else if (e.code === 'ArrowRight') {
        setTime(t => clamp(t + (e.shiftKey ? 1 : 0.1), 0, duration));
      } else if (e.key === '0' || e.code === 'Home') {
        setTime(0);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [duration]);

  const displayTime = hoverTime != null ? hoverTime : time;

  const ctxValue = React.useMemo(
    () => ({ time: displayTime, duration, playing, setTime, setPlaying }),
    [displayTime, duration, playing]
  );

  return (
    <div
      ref={stageRef}
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        background: '#0a0a0a',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Canvas area — vertically centered in remaining space */}
      <div style={{
        flex: 1,
        width: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        minHeight: 0,
      }}>
        <div
          ref={canvasRef}
          style={{
            width, height,
            background,
            position: 'relative',
            transform: `scale(${scale})`,
            transformOrigin: 'center',
            flexShrink: 0,
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            overflow: 'hidden',
          }}
        >
          <TimelineContext.Provider value={ctxValue}>
            {children}
          </TimelineContext.Provider>
        </div>
      </div>

      {/* Playback bar — stacked below canvas, never overlapping */}
      <PlaybackBar
        time={displayTime}
        actualTime={time}
        duration={duration}
        playing={playing}
        onPlayPause={() => {
          if (!playing && timeRef.current >= duration - 0.5) {
            setTime(0); setPlaying(true);
          } else { setPlaying(p => !p); }
        }}
        onReset={() => { setTime(0); }}
        onSeek={(t) => setTime(t)}
        onHover={(t) => setHoverTime(t)}
      />
    </div>
  );
}

// ── Playback bar ────────────────────────────────────────────────────────────
// Play/pause, return-to-begin, scrub track, time display.
// Uses fixed-width time fields so layout doesn't thrash.

function PlaybackBar({ time, duration, playing, onPlayPause, onReset, onSeek, onHover }) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);

  const timeFromEvent = React.useCallback((e) => {
    const rect = trackRef.current.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    return x * duration;
  }, [duration]);

  const onTrackMove = (e) => {
    if (!trackRef.current) return;
    const t = timeFromEvent(e);
    if (dragging) {
      onSeek(t);
    } else {
      onHover(t);
    }
  };

  const onTrackLeave = () => {
    if (!dragging) onHover(null);
  };

  const onTrackDown = (e) => {
    setDragging(true);
    const t = timeFromEvent(e);
    onSeek(t);
    onHover(null);
  };

  React.useEffect(() => {
    if (!dragging) return;
    const onUp = () => setDragging(false);
    const onMove = (e) => {
      if (!trackRef.current) return;
      const t = timeFromEvent(e);
      onSeek(t);
    };
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
    };
  }, [dragging, timeFromEvent, onSeek]);

  const pct = duration > 0 ? (time / duration) * 100 : 0;
  const fmt = (t) => {
    const total = Math.max(0, t);
    const m = Math.floor(total / 60);
    const s = Math.floor(total % 60);
    const cs = Math.floor((total * 100) % 100);
    return `${String(m).padStart(1, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  };

  const mono = 'JetBrains Mono, ui-monospace, SFMono-Regular, monospace';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '8px 16px',
      background: 'rgba(20,20,20,0.92)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      width: '100%',
      maxWidth: 680,
      alignSelf: 'center',

      borderRadius: 8,
      color: '#f6f4ef',
      fontFamily: 'Inter, system-ui, sans-serif',
      userSelect: 'none',
      flexShrink: 0,
    }}>
      <IconButton onClick={onReset} title="Return to start (0)">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 2v10M12 2L5 7l7 5V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
        </svg>
      </IconButton>
      <IconButton onClick={onPlayPause} title="Play/pause (space)">
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="3" y="2" width="3" height="10" fill="currentColor"/>
            <rect x="8" y="2" width="3" height="10" fill="currentColor"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 2l9 5-9 5V2z" fill="currentColor"/>
          </svg>
        )}
      </IconButton>

      {/* Current time: fixed width so it doesn't thrash */}
      <div style={{
        fontFamily: mono,
        fontSize: 12,
        fontVariantNumeric: 'tabular-nums',
        width: 64, textAlign: 'right',
        color: '#f6f4ef',
      }}>
        {fmt(time)}
      </div>

      {/* Scrub track */}
      <div
        ref={trackRef}
        onMouseMove={onTrackMove}
        onMouseLeave={onTrackLeave}
        onMouseDown={onTrackDown}
        style={{
          flex: 1,
          height: 22,
          position: 'relative',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center',
        }}
      >
        <div style={{
          position: 'absolute',
          left: 0, right: 0, height: 4,
          background: 'rgba(255,255,255,0.12)',
          borderRadius: 2,
        }}/>
        <div style={{
          position: 'absolute',
          left: 0, width: `${pct}%`, height: 4,
          background: 'oklch(72% 0.12 250)',
          borderRadius: 2,
        }}/>
        <div style={{
          position: 'absolute',
          left: `${pct}%`, top: '50%',
          width: 12, height: 12,
          marginLeft: -6, marginTop: -6,
          background: '#fff',
          borderRadius: 6,
          boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
        }}/>
      </div>

      {/* Duration: fixed width */}
      <div style={{
        fontFamily: mono,
        fontSize: 12,
        fontVariantNumeric: 'tabular-nums',
        width: 64, textAlign: 'left',
        color: 'rgba(246,244,239,0.55)',
      }}>
        {fmt(duration)}
      </div>
    </div>
  );
}

function IconButton({ children, onClick, title }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 28, height: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hover ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 6,
        color: '#f6f4ef',
        cursor: 'pointer',
        padding: 0,
        transition: 'background 120ms',
      }}
    >
      {children}
    </button>
  );
}


Object.assign(window, {
  Easing, interpolate, animate, clamp,
  TimelineContext, useTime, useTimeline,
  Sprite, SpriteContext, useSprite,
  TextSprite, ImageSprite, RectSprite,
  Stage, PlaybackBar,
});

// ─────────────────────────────────────────────────────────────────────────────
// LLM Knowledge: 3-Stage Explainer (v2) — whiteboard animation
// ─────────────────────────────────────────────────────────────────────────────

const INK='#2a2f2b',GREEN='#1f8a5b',LGREEN='rgba(31,138,91,0.11)',AMBER='#b07d18',LAMBER='rgba(176,125,24,0.10)',FADE='rgba(42,47,43,0.42)';
const VW=1280,VH=720;
const HAND="'Patrick Hand', cursive",HTITLE="'Caveat', cursive",MONO="'JetBrains Mono', ui-monospace, monospace";

function SketchDefs(){return(<svg width="0" height="0" style={{position:'absolute',overflow:'hidden',pointerEvents:'none'}}><defs><filter id="rough" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.017" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.8" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg>);}
function Paper(){return <div style={{position:'absolute',inset:0,pointerEvents:'none',backgroundImage:'radial-gradient(circle, rgba(42,47,43,0.11) 1.2px, transparent 1.2px)',backgroundSize:'34px 34px'}}/>;}
function Draw({start,end,dur=0.55,children}){return(<Sprite start={start} end={end}>{({localTime})=>children(clamp(localTime/dur,0,1),localTime)}</Sprite>);}
function Scene({start,end,fade=0.4,children}){const t=useTime();if(t<start-0.05||t>end+0.05)return null;const op=Math.min(Easing.easeOutCubic(clamp((t-start)/fade,0,1)),Easing.easeOutCubic(clamp((end-t)/fade,0,1)));return <div style={{position:'absolute',inset:0,opacity:op}}>{children}</div>;}
function Label({start,end,x=0,y=0,size=24,color=INK,font=HAND,weight=400,align='left',width:lw='auto',style,children}){return(<Sprite start={start} end={end}>{({localTime,duration})=>{const fin=isFinite(duration)?duration:9999;const inP=Easing.easeOutCubic(clamp(localTime/0.36,0,1));const outP=Easing.easeInCubic(clamp((localTime-(fin-0.36))/0.36,0,1));const op=Math.min(inP,1-outP);const ty=(1-inP)*11;return <div style={{position:'absolute',left:x,top:y,width:lw,opacity:op,transform:`translateY(${ty}px)`,fontFamily:font,fontSize:size,color,fontWeight:weight,textAlign:align,lineHeight:1.35,whiteSpace:'pre-line',pointerEvents:'none',...style}}>{children}</div>;}}</Sprite>);}
function Box({x,y,w,h,draw=1,fill='none',stroke=INK,sw=2.6,r=13,children,childStyle,labelSize=21}){const perim=2*(w+h);const offset=perim*(1-clamp(draw,0,1));return(<div style={{position:'absolute',left:x,top:y,width:w,height:h}}><svg width={w} height={h} style={{position:'absolute',inset:0,overflow:'visible'}}><rect x={sw+1} y={sw+1} width={w-2*(sw+1)} height={h-2*(sw+1)} rx={r} ry={r} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={perim} strokeDashoffset={offset} strokeLinecap="round" filter="url(#rough)"/></svg><div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',padding:'8px 14px',textAlign:'center',fontFamily:HAND,fontSize:labelSize,color:INK,lineHeight:1.35,whiteSpace:'pre-line',...childStyle}}>{children}</div></div>);}
function Arrow({x1,y1,x2,y2,cx,cy,draw=1,color=INK,sw=2.5}){const mx=cx!==undefined?cx:(x1+x2)/2;const my=cy!==undefined?cy:(y1+y2)/2;const path=`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;const ang=Math.atan2(y2-my,x2-mx);const hl=13,ha=0.42;const h1=`M ${x2} ${y2} L ${x2-hl*Math.cos(ang-ha)} ${y2-hl*Math.sin(ang-ha)}`;const h2=`M ${x2} ${y2} L ${x2-hl*Math.cos(ang+ha)} ${y2-hl*Math.sin(ang+ha)}`;const hOp=clamp((draw-0.80)/0.20,0,1);return(<svg style={{position:'absolute',left:0,top:0,width:VW,height:VH,overflow:'visible',pointerEvents:'none'}}><path d={path} fill="none" stroke={color} strokeWidth={sw} pathLength="1" strokeDasharray="1" strokeDashoffset={1-clamp(draw,0,1)} strokeLinecap="round" filter="url(#rough)"/><g opacity={hOp}><path d={h1} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" filter="url(#rough)"/><path d={h2} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" filter="url(#rough)"/></g></svg>);}
function Squiggle({x,y,len,draw=1,color=GREEN,sw=4}){const d=`M ${x} ${y} Q ${x+len*0.25} ${y+7} ${x+len*0.5} ${y} Q ${x+len*0.75} ${y-7} ${x+len} ${y}`;return(<svg style={{position:'absolute',left:0,top:0,width:VW,height:VH,overflow:'visible',pointerEvents:'none'}}><path d={d} fill="none" stroke={color} strokeWidth={sw} pathLength="1" strokeDasharray="1" strokeDashoffset={1-clamp(draw,0,1)} strokeLinecap="round" filter="url(#rough)"/></svg>);}

function LogitBar({x,y,label,barMaxW=196,score,prob,color=GREEN,draw=1}){
  const w=barMaxW*clamp(draw,0,1);
  return(<div style={{position:'absolute',left:x,top:y,display:'flex',alignItems:'center',gap:7}}>
    <div style={{width:60,fontFamily:HAND,fontSize:18,color:INK,textAlign:'right',flexShrink:0}}>{label}</div>
    <div style={{width:barMaxW,height:24,background:'rgba(42,47,43,0.07)',borderRadius:4,overflow:'hidden',flexShrink:0}}><div style={{width:w,height:'100%',background:color,borderRadius:4}}/></div>
    <div style={{fontFamily:MONO,fontSize:14,color:FADE,width:30}}>{score}</div>
    <div style={{fontFamily:HAND,fontSize:17,color,fontWeight:600,width:42}}>{prob}</div>
  </div>);
}

function TopBar({start,end}){
  const t=useTime();
  if(t<start||t>end)return null;
  const op=Math.min(Easing.easeOutCubic(clamp((t-start)/0.5,0,1)),Easing.easeOutCubic(clamp((end-t)/0.5,0,1)));
  const active=t<56?0:t<90?1:t<108?2:t<126?3:-1;
  const stages=['① Pre-training','② SFT','③ RL + HF','④ Inference'];
  const cols=[GREEN,AMBER,INK,GREEN];
  return(<div style={{position:'absolute',top:12,left:0,right:0,display:'flex',justifyContent:'center',opacity:op,pointerEvents:'none',zIndex:10}}>
    <div style={{display:'flex',gap:4,background:'rgba(245,242,232,0.93)',border:'1.5px solid rgba(42,47,43,0.25)',borderRadius:28,padding:'5px 12px',boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
      {stages.map((s,i)=>(<div key={i} style={{fontFamily:HAND,fontSize:17,padding:'3px 14px',borderRadius:20,background:i===active?cols[i]:'transparent',color:i===active?'#fff':FADE,fontWeight:i===active?600:400}}>{s}</div>))}
    </div>
  </div>);
}

// ══ TITLE ════════════════════════════════════════════════════════════════════
function TitleScene(){
  const SE=4.2;
  return(<Scene start={0} end={SE}>
    <Label start={0.15} end={SE} x={0} y={185} size={112} font={HTITLE} weight={700} color={INK} align="center" width={VW}>How LLMs Work</Label>
    <Draw start={1.2} end={SE} dur={0.7}>{(d)=><Squiggle x={252} y={323} len={776} draw={d} color={GREEN} sw={5}/>}</Draw>
    <Label start={1.4} end={SE} x={0} y={343} size={33} font={HAND} align="center" width={VW} color={INK}>From raw text to a helpful assistant — in 3 stages</Label>
    {['① Pre-training','② Supervised Fine-Tuning','③ RL + Human Feedback'].map((s,i)=>(
      <Label key={i} start={2.1+i*0.38} end={SE} x={0} y={432+i*52} size={27} font={HAND} align="center" width={VW} color={i===0?GREEN:i===1?AMBER:INK} weight={600}>{s}</Label>
    ))}
  </Scene>);
}

// ══ ROADMAP ═══════════════════════════════════════════════════════════════════
function RoadmapScene(){
  const SS=4.2,SE=7.2;
  const nodes=[{x:22,label:'① Pre-training',sub:'base model',color:GREEN},{x:328,label:'② SFT',sub:'instruct model',color:AMBER},{x:634,label:'③ RL + HF',sub:'aligned model',color:INK},{x:940,label:'④ Inference',sub:'generation',color:GREEN}];
  return(<Scene start={SS} end={SE}>
    <Label start={SS+0.1} end={SE} x={0} y={195} size={40} font={HTITLE} weight={700} align="center" width={VW} color={INK}>The 3-stage journey of an LLM</Label>
    {nodes.map((n,i)=>(<React.Fragment key={i}>
      <Draw start={SS+0.45+i*0.52} end={SE} dur={0.5}>{(d)=>
        <Box x={n.x} y={285} w={278} h={130} draw={d} stroke={n.color} sw={3} fill={i===0?LGREEN:'none'} r={18} labelSize={24}>
          <div><div style={{fontSize:26,fontFamily:HTITLE,color:n.color,fontWeight:700}}>{n.label}</div><div style={{fontSize:16,color:FADE,marginTop:3}}>{n.sub}</div></div>
        </Box>}
      </Draw>
      {i<3&&<Draw start={SS+0.95+i*0.52} end={SE} dur={0.4}>{(d)=><Arrow x1={n.x+278} y1={350} x2={nodes[i+1].x} y2={350} draw={d} color={FADE} sw={2.5}/>}</Draw>}
    </React.Fragment>))}
  </Scene>);
}

// ══ WHAT IS AN LLM (7.2–11.5) ════════════════════════════════════════════════
function LLMDefScene(){
  const SS=7.2,SE=11.5;
  return(<Scene start={SS} end={SE}>
    <Label start={SS+0.2} end={SE} x={0} y={55} size={42} font={HTITLE} weight={700} align="center" width={VW} color={INK}>What exactly IS a Large Language Model?</Label>
    <Draw start={SS+0.8} end={SE} dur={0.6}>{(d)=>
      <Box x={75} y={128} w={1130} h={162} draw={d} stroke={GREEN} fill={LGREEN} sw={2.8} r={18} labelSize={22} childStyle={{alignItems:'flex-start',padding:'16px 26px'}}>
        <div style={{textAlign:'left'}}>
          <div style={{fontSize:23,fontWeight:600,color:GREEN,marginBottom:8}}>A neural network with billions of adjustable numbers called <b>parameters</b> (or weights)</div>
          <div style={{fontSize:19,color:FADE}}>These weights encode everything learned — language patterns, world facts, reasoning — all as floating-point numbers. Pre-training builds them. SFT shapes them. RL aligns them.</div>
        </div>
      </Box>}
    </Draw>
    {[
      {x:75,  label:'Llama 3',  detail:'8B – 405B parameters\nopen-source · Meta',       color:AMBER},
      {x:457, label:'GPT-4',    detail:'~1.8 trillion parameters\nproprietary · OpenAI',   color:AMBER},
      {x:839, label:'Claude 3', detail:'Trillions of parameters\nproprietary · Anthropic', color:GREEN},
    ].map((m,i)=>(
      <Draw key={i} start={SS+1.8+i*0.55} end={SE} dur={0.5}>{(d)=>
        <Box x={m.x} y={325} w={360} h={118} draw={d} stroke={m.color} fill={i<2?LAMBER:LGREEN} sw={2.5} r={14} labelSize={20}>
          <div><div style={{fontSize:23,fontWeight:700,color:m.color}}>{m.label}</div><div style={{fontSize:16,marginTop:4,color:FADE}}>{m.detail}</div></div>
        </Box>}
      </Draw>
    ))}
    <Label start={SS+3.5} end={SE} x={0} y={482} size={19} font={HAND} align="center" width={VW} color={FADE}>More parameters ≠ always better — architecture, data quality, and fine-tuning matter just as much</Label>
  </Scene>);
}

// ══ DATA COMPANIES (11.5–18) ══════════════════════════════════════════════════
function DataCompaniesScene(){
  const SS=11.5,SE=18;
  const boxes=[
    {label:'Public Internet\nWikipedia · Books\nCode · Papers',stroke:INK,fill:'none'},
    {label:'Data Pipeline\nCompanies\nCommonCrawl · C4\nRefinedWeb',stroke:AMBER,fill:LAMBER},
    {label:'Clean corpus\n~1–15 TB\nfiltered & safe',stroke:INK,fill:'none'},
    {label:'AI Labs\nOpenAI · Anthropic\nGoogle · Meta',stroke:GREEN,fill:LGREEN},
  ];
  const xs=[30,278,526,774],ws=[200,200,200,230],PY=195,BH=168;
  return(<Scene start={SS} end={SE}>
    <Label start={SS+0.2} end={SE} x={42} y={55} size={34} font={HTITLE} weight={700} color={AMBER}>Where does training data come from?</Label>
    {boxes.map((b,i)=>(
      <Draw key={i} start={SS+0.55+i*0.65} end={SE} dur={0.5}>{(d)=>
        <Box x={xs[i]} y={PY} w={ws[i]} h={BH} draw={d} stroke={b.stroke} fill={b.fill} sw={2.8} r={14} labelSize={18}>{b.label}</Box>}
      </Draw>
    ))}
    {[0,1,2].map(i=>(
      <Draw key={i} start={SS+1.0+i*0.65} end={SE} dur={0.4}>{(d)=>
        <Arrow x1={xs[i]+ws[i]} y1={PY+BH/2} x2={xs[i+1]} y2={PY+BH/2} draw={d} color={FADE} sw={2.5}/>}
      </Draw>
    ))}
    <Draw start={SS+3.8} end={SE} dur={0.4}>{(d)=><Arrow x1={378} y1={PY+BH} x2={370} y2={415} draw={d} color={AMBER} sw={2}/>}</Draw>
    <Draw start={SS+4.1} end={SE} dur={0.55}>{(d)=>
      <Box x={38} y={420} w={565} h={215} draw={d} stroke={AMBER} fill={LAMBER} sw={2.3} r={14} labelSize={19} childStyle={{alignItems:'flex-start',padding:'12px 18px'}}>
        <div style={{textAlign:'left'}}>
          <div style={{fontSize:20,fontWeight:600,color:AMBER,marginBottom:6}}>What data companies do:</div>
          <div style={{fontSize:18,marginBottom:2}}>• Crawl billions of web pages (petabytes)</div>
          <div style={{fontSize:18,marginBottom:2}}>• Deduplicate — remove repeated content</div>
          <div style={{fontSize:18,marginBottom:2}}>• Filter toxic, unsafe, NSFW content</div>
          <div style={{fontSize:18,marginBottom:2}}>• Remove personal info (PII)</div>
          <div style={{fontSize:18}}>• Quality-filter — keep only high-value text</div>
        </div>
      </Box>}
    </Draw>
    <Label start={SS+5.2} end={SE} x={632} y={425} size={17} font={HAND} color={FADE} width={560}>{"Exact training data is proprietary\nfor commercial models — kept secret.\n\nOpen datasets:\nCommonCrawl · RefinedWeb · The Pile\nRedPajama · C4 (Colossal Clean Crawled)\n\nThese are sold / licensed to AI labs\nor used under open-source licenses"}</Label>
  </Scene>);
}

// ══ STAGE 1 PIPELINE (18–34) ══════════════════════════════════════════════════
function Stage1MainScene(){
  const SS=18,SE=34,PY=222;
  const pipeline=[
    {x:28, w:185,h:108,label:'Clean corpus\n~15 TB filtered',         stroke:INK,  fill:'none'},
    {x:268,w:200,h:108,label:'Tokenize\n(BPE)',                        stroke:AMBER,fill:LAMBER},
    {x:523,w:248,h:108,label:'Train: predict\nnext token\n×1 trillion',stroke:AMBER,fill:LAMBER},
    {x:836,w:410,h:138,label:'Base / Foundation Model\n8B params · ~16 GB GPU memory\nNot an assistant — just a\nnext-token predictor',stroke:GREEN,fill:LGREEN},
  ];
  const pipeT=[SS+0.55,SS+1.35,SS+2.2,SS+3.1];
  const arrows=[{x1:213,y1:PY+54,x2:268,y2:PY+54},{x1:468,y1:PY+54,x2:523,y2:PY+54},{x1:771,y1:PY+54,x2:836,y2:PY+60}];
  const arrowT=[SS+1.1,SS+1.9,SS+2.8];
  const boxB=PY+108;
  return(<Scene start={SS} end={SE}>
    <Label start={SS+0.2} end={SE} x={42} y={52} size={34} font={HTITLE} weight={700} color={GREEN}>Stage 1 — Pre-training → Base Model</Label>
    <Label start={SS+0.5} end={SE} x={42} y={95} size={18} font={HAND} color={FADE}>🌱 Like childhood — absorbing language and world knowledge from everything</Label>
    {pipeline.map((b,i)=>(
      <Draw key={i} start={pipeT[i]} end={SE} dur={0.5}>{(d)=>
        <Box x={b.x} y={PY} w={b.w} h={b.h} draw={d} stroke={b.stroke} fill={b.fill} sw={2.8} labelSize={i===3?17:20}>{b.label}</Box>}
      </Draw>
    ))}
    {arrows.map((a,i)=>(
      <Draw key={i} start={arrowT[i]} end={SE} dur={0.4}>{(d)=>
        <Arrow x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} draw={d} color={FADE} sw={2.5}/>}
      </Draw>
    ))}
    {/* Tokenize callout */}
    <Draw start={SS+5.0} end={SE} dur={0.4}>{(d)=><Arrow x1={368} y1={boxB} x2={265} y2={405} draw={d} color={AMBER} sw={2} cx={315} cy={365}/>}</Draw>
    <Draw start={SS+5.3} end={SE} dur={0.55}>{(d)=>
      <Box x={30} y={410} w={468} h={218} draw={d} stroke={AMBER} sw={2.3} r={14} labelSize={20} childStyle={{alignItems:'flex-start',padding:'12px 16px'}}>
        <div style={{textAlign:'left'}}>
          <div style={{fontFamily:MONO,fontSize:17,color:AMBER,marginBottom:5}}>"What is Java?"</div>
          <div style={{fontSize:18,marginBottom:2}}>→ UTF-8 bytes → raw bit stream</div>
          <div style={{fontSize:18,marginBottom:2}}>→ BPE merges frequent byte pairs</div>
          <div style={{fontFamily:MONO,fontSize:16,color:GREEN,marginBottom:5}}>[What][ is][ Java][?]  ← tokens</div>
          <div style={{fontSize:16,color:FADE}}>Vocab: GPT-4 ≈ 100k token types · Google ≈ 200k</div>
          <div style={{fontSize:16,color:FADE,marginTop:2}}>Context window: GPT-4 128k · Claude 200k tokens</div>
        </div>
      </Box>}
    </Draw>
    {/* Training loop callout */}
    <Draw start={SS+5.8} end={SE} dur={0.4}>{(d)=><Arrow x1={647} y1={boxB} x2={780} y2={405} draw={d} color={AMBER} sw={2} cx={713} cy={365}/>}</Draw>
    <Draw start={SS+6.1} end={SE} dur={0.55}>{(d)=>
      <Box x={508} y={410} w={742} h={218} draw={d} stroke={AMBER} sw={2.3} r={14} labelSize={20} childStyle={{alignItems:'flex-start',padding:'12px 18px'}}>
        <div style={{textAlign:'left'}}>
          <div style={{fontSize:20,fontWeight:600,color:AMBER,marginBottom:6}}>How training works:</div>
          <div style={{fontSize:18,marginBottom:2}}>① Feed token sequence into transformer</div>
          <div style={{fontSize:18,marginBottom:2}}>② Model predicts next token (often wrong at first!)</div>
          <div style={{fontSize:18,marginBottom:2}}>③ Compute error → gradient descent</div>
          <div style={{fontSize:18,marginBottom:5}}>④ Nudge all 8B weights slightly in right direction</div>
          <div style={{fontSize:16,color:FADE}}>Repeat 1 trillion+ times → model learns language, facts, reasoning</div>
        </div>
      </Box>}
    </Draw>
  </Scene>);
}

// ══ TOKEN-BY-TOKEN SCENE (34–56) ══════════════════════════════════════════════
function TokenScene(){
  const SS=34,SE=56;
  const tokens=['The','capital','of','France','is'];
  const TBX=i=>28+i*115,TBY=90,TBW=105,TBH=55;
  return(<Scene start={SS} end={SE}>
    <Label start={SS+0.2} end={SE} x={0} y={26} size={36} font={HTITLE} weight={700} align="center" width={VW} color={INK}>How text is generated: one token at a time</Label>
    {/* Input tokens */}
    {tokens.map((tok,i)=>(
      <Draw key={i} start={SS+0.7+i*0.22} end={SE} dur={0.45}>{(d)=>
        <Box x={TBX(i)} y={TBY} w={TBW} h={TBH} draw={d} stroke={INK} fill='none' sw={2.5} r={10} labelSize={19}>{tok}</Box>}
      </Draw>
    ))}
    <Label start={SS+1.8} end={SS+14.5} x={28} y={TBY+TBH+4} size={15} font={HAND} color={FADE}>current context →</Label>
    {/* Position 6 placeholder */}
    <Draw start={SS+1.5} end={SS+13.5} dur={0.5}>{(d)=>
      <Box x={TBX(5)} y={TBY} w={TBW} h={TBH} draw={d} stroke={FADE} sw={1.8} r={10} labelSize={22} childStyle={{color:FADE}}>?</Box>}
    </Draw>
    {/* Arrow tokens → transformer */}
    <Draw start={SS+2.0} end={SE} dur={0.4}>{(d)=><Arrow x1={368} y1={TBY+TBH} x2={368} y2={193} draw={d} color={FADE} sw={2.5}/>}</Draw>
    {/* Transformer block full width */}
    <Draw start={SS+2.5} end={SE} dur={0.6}>{(d)=>
      <Box x={35} y={196} w={1210} h={118} draw={d} stroke={GREEN} fill={LGREEN} sw={3} r={16} labelSize={22} childStyle={{alignItems:'flex-start',padding:'8px 24px'}}>
        <div style={{textAlign:'left',width:'100%'}}>
          <div style={{fontSize:23,fontWeight:700,color:GREEN,marginBottom:3}}>TRANSFORMER (32–96 attention layers)</div>
          <div style={{fontSize:18,color:FADE}}>Every token attends to every other — self-attention learns meaning from context relationships</div>
          <div style={{fontSize:17,color:FADE,marginTop:2}}>Output: a raw score (logit) for each of the ~100k words in vocabulary</div>
        </div>
      </Box>}
    </Draw>
    {/* Arrow transformer → logits */}
    <Draw start={SS+4.5} end={SE} dur={0.4}>{(d)=><Arrow x1={175} y1={314} x2={175} y2={362} draw={d} color={AMBER} sw={2.5}/>}</Draw>
    <Label start={SS+5.0} end={SE} x={35} y={368} size={19} font={HAND} weight={600} color={AMBER}>Top vocabulary candidates (logits → probabilities via softmax):</Label>
    {/* Logit bars */}
    {[
      {label:'Paris', barMaxW:210,score:'4.2',prob:'58%',color:GREEN},
      {label:'London',barMaxW:105,score:'2.1',prob:'16%',color:FADE},
      {label:'Berlin',barMaxW: 88,score:'1.8',prob:'13%',color:FADE},
      {label:'Rome',  barMaxW: 70,score:'1.4',prob: '9%',color:FADE},
      {label:'Tokyo', barMaxW: 46,score:'0.9',prob: '4%',color:FADE},
    ].map((b,i)=>(
      <Draw key={i} start={SS+5.5+i*0.55} end={SE} dur={0.5}>{(d)=>
        <LogitBar x={35} y={396+i*38} label={b.label} barMaxW={b.barMaxW} score={b.score} prob={b.prob} color={b.color} draw={d}/>}
      </Draw>
    ))}
    {/* Filter notes */}
    <Label start={SS+8.0} end={SE} x={635} y={370} size={19} font={HAND} weight={600} color={INK}>Apply controls before sampling:</Label>
    {[
      'Temperature < 1 → predictable (T=0.3 for factual tasks)',
      'Temperature > 1 → creative  (T=1.2 for brainstorming)',
      'Top-k = 50: keep only the top 50 candidate words',
      'Top-p = 0.9: nucleus — keep fewest covering 90% prob',
    ].map((line,i)=>(
      <Label key={i} start={SS+8.6+i*0.55} end={SE} x={635} y={398+i*38} size={17} font={HAND} color={FADE}>• {line}</Label>
    ))}
    {/* Sampling result */}
    <Label start={SS+11.5} end={SS+14.5} x={635} y={570} size={34} font={HTITLE} weight={700} color={GREEN}>→ Sampled: 'Paris' ✓</Label>
    {/* Paris token slides to position 6 */}
    <Sprite start={SS+13.0} end={SE}>
      {({localTime})=>{
        const prog=Easing.easeInOutCubic(clamp((localTime-0.15)/2.0,0,1));
        const bx=635+(TBX(5)-635)*prog;
        const by=570+(TBY-570)*prog;
        const op=clamp(localTime/0.4,0,1);
        return(<div style={{position:'absolute',left:bx,top:by,width:TBW,height:TBH,opacity:op}}>
          <Box x={0} y={0} w={TBW} h={TBH} draw={1} stroke={GREEN} fill={LGREEN} sw={2.5} r={10} labelSize={19}>Paris</Box>
        </div>);
      }}
    </Sprite>
    {/* New input label */}
    <Label start={SS+15.5} end={SE} x={0} y={TBY+TBH+4} size={15} font={HAND} color={GREEN} align="center" width={VW}>
      [The][capital][of][France][is][Paris] → now 6 tokens, fed back as new input for next step ↺
    </Label>
    {/* Key insight */}
    <Label start={SS+17.5} end={SE} x={0} y={632} size={22} font={HAND} align="center" width={VW} color={INK} weight={600}>
      Output is built ONE TOKEN AT A TIME — that's why you see text streaming live as it generates
    </Label>
  </Scene>);
}

// ══ STAGE 2a: SFT (56–70) ════════════════════════════════════════════════════
function Stage2aScene(){
  const SS=56,SE=70,PY=122;
  return(<Scene start={SS} end={SE}>
    <Label start={SS+0.2} end={SE} x={42} y={50} size={34} font={HTITLE} weight={700} color={AMBER}>Stage 2 — Supervised Fine-Tuning (SFT)</Label>
    <Label start={SS+0.5} end={SE} x={42} y={92} size={18} font={HAND} color={FADE}>🍼 Like learning to walk and talk — developing basic interactive and social skills</Label>
    <Draw start={SS+0.6} end={SE} dur={0.5}>{(d)=>
      <Box x={32} y={PY} w={215} h={105} draw={d} stroke={GREEN} fill={LGREEN} sw={2.8} labelSize={21}>{'Base Model\n(16 GB brain)'}</Box>}
    </Draw>
    <Draw start={SS+1.2} end={SE} dur={0.4}>{(d)=><Arrow x1={247} y1={PY+52} x2={340} y2={PY+52} draw={d} color={FADE} sw={2.5}/>}</Draw>
    <Draw start={SS+1.6} end={SE} dur={0.55}>{(d)=>
      <Box x={340} y={PY-14} w={295} h={132} draw={d} stroke={AMBER} fill={LAMBER} sw={2.8} r={14} labelSize={21}>
        <div>
          <div style={{fontSize:22,fontWeight:600,color:AMBER}}>SFT Training</div>
          <div style={{fontSize:18,marginTop:4}}>Show example Q&amp;A pairs<br/>(prompt → ideal answer)</div>
          <div style={{fontSize:14,color:FADE,marginTop:2}}>"supervised" = we know the right answer</div>
        </div>
      </Box>}
    </Draw>
    <Draw start={SS+2.4} end={SE} dur={0.4}>{(d)=><Arrow x1={635} y1={PY+52} x2={730} y2={PY+52} draw={d} color={FADE} sw={2.5}/>}</Draw>
    <Draw start={SS+2.8} end={SE} dur={0.55}>{(d)=>
      <Box x={730} y={PY-8} w={510} h={118} draw={d} stroke={GREEN} fill={LGREEN} sw={3} r={16} labelSize={23}>
        <div><div style={{fontSize:26,fontWeight:700,color:GREEN}}>Instruct Model</div><div style={{fontSize:20,marginTop:4}}>→ Helpful Assistant ✓</div></div>
      </Box>}
    </Draw>
    {/* Chat template */}
    <Draw start={SS+3.8} end={SE} dur={0.55}>{(d)=>
      <Box x={32} y={268} w={590} h={210} draw={d} stroke={AMBER} fill={LAMBER} sw={2.3} r={14} labelSize={19} childStyle={{alignItems:'flex-start',padding:'12px 18px'}}>
        <div style={{textAlign:'left'}}>
          <div style={{fontSize:20,fontWeight:600,color:AMBER,marginBottom:8}}>Chat template (instruction format):</div>
          <div style={{fontFamily:MONO,fontSize:14,color:INK,marginBottom:3}}>[SYSTEM] You are a helpful assistant</div>
          <div style={{fontFamily:MONO,fontSize:14,color:GREEN,marginBottom:3}}>[USER] What is the capital of France?</div>
          <div style={{fontFamily:MONO,fontSize:14,color:INK,marginBottom:8}}>[ASSISTANT] The capital of France is Paris.</div>
          <div style={{fontSize:16,color:FADE}}>SFT trains the model to respond in this exact format — trained on thousands of such examples to learn WHEN and HOW to answer</div>
        </div>
      </Box>}
    </Draw>
    {/* Human labellers */}
    <Draw start={SS+5.0} end={SE} dur={0.5}>{(d)=>
      <Box x={643} y={268} w={325} h={100} draw={d} stroke={INK} sw={2.3} r={14} labelSize={19} childStyle={{alignItems:'flex-start',padding:'10px 14px'}}>
        <div><div style={{fontSize:20,fontWeight:600,marginBottom:3}}>Human Labellers</div><div style={{fontSize:17,color:FADE}}>Hired pros write ideal Q&amp;A<br/>e.g. OpenAssistant oasst1</div></div>
      </Box>}
    </Draw>
    {/* Synthetic data */}
    <Draw start={SS+6.0} end={SE} dur={0.5}>{(d)=>
      <Box x={643} y={382} w={325} h={100} draw={d} stroke={INK} sw={2.3} r={14} labelSize={19} childStyle={{alignItems:'flex-start',padding:'10px 14px'}}>
        <div><div style={{fontSize:20,fontWeight:600,marginBottom:3}}>Synthetic Data</div><div style={{fontSize:17,color:FADE}}>Ask Claude/GPT to generate<br/>Q&amp;A at scale (UltraChat)</div></div>
      </Box>}
    </Draw>
    {/* Amnesia warning */}
    <Draw start={SS+7.5} end={SE} dur={0.5}>{(d)=>
      <Box x={986} y={268} w={258} h={215} draw={d} stroke={AMBER} fill={LAMBER} sw={2.3} r={14} labelSize={18} childStyle={{alignItems:'flex-start',padding:'10px 14px'}}>
        <div style={{textAlign:'left'}}>
          <div style={{fontSize:18,fontWeight:600,color:AMBER,marginBottom:5}}>⚠ Amnesia risk</div>
          <div style={{fontSize:17,color:FADE}}>Over-train on your domain data → model forgets general capabilities (math, coding, etc.)</div>
          <div style={{fontSize:16,color:AMBER,marginTop:6}}>Solution: mix domain data with general data</div>
        </div>
      </Box>}
    </Draw>
    <Label start={SS+9.5} end={SE} x={0} y={628} size={20} font={HAND} align="center" width={VW} color={FADE}>Goal: the base model predicts text → SFT teaches it to be a helpful, responsive assistant</Label>
  </Scene>);
}

// ══ RAG vs FINE-TUNING (70–80) ════════════════════════════════════════════════
function RagVsFtScene(){
  const SS=70,SE=80;
  return(<Scene start={SS} end={SE}>
    <Label start={SS+0.2} end={SE} x={0} y={38} size={38} font={HTITLE} weight={700} align="center" width={VW} color={INK}>RAG vs Fine-Tuning — when to use which?</Label>
    {/* RAG box */}
    <Draw start={SS+0.7} end={SE} dur={0.6}>{(d)=>
      <Box x={32} y={110} w={555} h={445} draw={d} stroke={AMBER} fill={LAMBER} sw={3} r={18} labelSize={21} childStyle={{alignItems:'flex-start',justifyContent:'flex-start',padding:'18px 22px'}}>
        <div style={{textAlign:'left',width:'100%'}}>
          <div style={{fontSize:26,fontWeight:700,color:AMBER,marginBottom:4}}>RAG</div>
          <div style={{fontSize:17,color:FADE,marginBottom:10}}>Retrieval-Augmented Generation — search external knowledge, inject into prompt</div>
          <div style={{fontSize:18,marginBottom:3}}>✓ Facts &amp; up-to-date information</div>
          <div style={{fontSize:18,marginBottom:3}}>✓ Latest news, proprietary docs</div>
          <div style={{fontSize:18,marginBottom:3}}>✓ Source citations possible</div>
          <div style={{fontSize:18,marginBottom:3}}>✓ No amnesia risk</div>
          <div style={{fontSize:18,marginBottom:10}}>✓ No retraining needed</div>
          <div style={{fontSize:17,color:AMBER,fontWeight:600,marginBottom:3}}>→ Use when: you need to answer from specific documents or data</div>
          <div style={{fontSize:16,color:FADE}}>e.g. customer support bot querying your knowledge base; medical Q&amp;A with citations</div>
        </div>
      </Box>}
    </Draw>
    {/* VS label */}
    <Label start={SS+0.7} end={SE} x={615} y={295} size={42} font={HTITLE} weight={700} color={FADE} align="center" width={50}>vs</Label>
    {/* Fine-tuning box */}
    <Draw start={SS+1.3} end={SE} dur={0.6}>{(d)=>
      <Box x={665} y={110} w={575} h={445} draw={d} stroke={GREEN} fill={LGREEN} sw={3} r={18} labelSize={21} childStyle={{alignItems:'flex-start',justifyContent:'flex-start',padding:'18px 22px'}}>
        <div style={{textAlign:'left',width:'100%'}}>
          <div style={{fontSize:26,fontWeight:700,color:GREEN,marginBottom:4}}>Fine-Tuning</div>
          <div style={{fontSize:17,color:FADE,marginBottom:10}}>Train the model on your data → behavior changes permanently</div>
          <div style={{fontSize:18,marginBottom:3}}>✓ Change style, tone, persona</div>
          <div style={{fontSize:18,marginBottom:3}}>✓ Teach domain jargon &amp; terminology</div>
          <div style={{fontSize:18,marginBottom:3}}>✓ Enforce strict output formats</div>
          <div style={{fontSize:18,marginBottom:3}}>✓ Faster at inference (no retrieval)</div>
          <div style={{fontSize:18,marginBottom:10}}>⚠ Risk: amnesia if over-trained</div>
          <div style={{fontSize:17,color:GREEN,fontWeight:600,marginBottom:3}}>→ Use when: you want the model to ACT differently</div>
          <div style={{fontSize:16,color:FADE}}>e.g. legal writing style, medical report format, brand voice</div>
        </div>
      </Box>}
    </Draw>
    <Label start={SS+5.0} end={SE} x={0} y={596} size={22} font={HAND} align="center" width={VW} color={INK} weight={600}>Rule of thumb: RAG for facts (what it knows), Fine-tuning for behavior (how it responds)</Label>
    <Label start={SS+6.5} end={SE} x={0} y={634} size={18} font={HAND} align="center" width={VW} color={FADE}>They're complementary — fine-tune for style, add RAG for knowledge</Label>
  </Scene>);
}

// ══ STAGE 2b: LoRA (80–90) ═══════════════════════════════════════════════════
function Stage2bScene(){
  const SS=80,SE=90;
  return(<Scene start={SS} end={SE}>
    <Label start={SS+0.2} end={SE} x={42} y={52} size={34} font={HTITLE} weight={700} color={AMBER}>Stage 2 — Fine-tune on YOUR Data (LoRA)</Label>
    <Draw start={SS+0.6} end={SE} dur={0.55}>{(d)=>
      <Box x={55} y={210} w={280} h={185} draw={d} stroke={GREEN} fill={LGREEN} sw={3} r={16} labelSize={22}>
        <div><div style={{fontSize:24,fontWeight:700,color:GREEN}}>Base Model</div><div style={{fontSize:38,margin:'4px 0'}}>❄</div><div style={{fontSize:18,color:FADE}}>16 GB — frozen weights</div></div>
      </Box>}
    </Draw>
    <Draw start={SS+1.5} end={SE} dur={0.5}>{(d)=>
      <Box x={292} y={293} w={162} h={115} draw={d} stroke={AMBER} fill={LAMBER} sw={2.8} r={12} labelSize={21}>
        <div><div style={{fontSize:22,fontWeight:600,color:AMBER}}>LoRA</div><div style={{fontSize:19}}>+100 MB</div><div style={{fontSize:14,color:FADE}}>adapter</div></div>
      </Box>}
    </Draw>
    <Label start={SS+1.5} end={SE} x={332} y={240} size={44} font={HTITLE} weight={700} color={AMBER}>+</Label>
    <Draw start={SS+2.3} end={SE} dur={0.45}>{(d)=><Arrow x1={462} y1={314} x2={580} y2={314} draw={d} color={FADE} sw={2.5}/>}</Draw>
    <Draw start={SS+2.7} end={SE} dur={0.55}>{(d)=>
      <Box x={580} y={208} w={400} h={152} draw={d} stroke={GREEN} fill={LGREEN} sw={3} r={16} labelSize={23}>
        <div><div style={{fontSize:25,fontWeight:700,color:GREEN}}>Your Fine-tuned Model</div><div style={{fontSize:18,marginTop:5}}>base model + tiny adapter layer</div></div>
      </Box>}
    </Draw>
    <Draw start={SS+3.4} end={SE} dur={0.45}>{(d)=><Arrow x1={780} y1={495} x2={780} y2={362} draw={d} color={AMBER} sw={2} cx={780} cy={430}/>}</Draw>
    <Label start={SS+3.6} end={SE} x={655} y={502} size={19} font={HAND} color={AMBER}>your business PDFs / docs</Label>
    {[
      '• Unsloth + LoRA: freeze the 16 GB base, train only a tiny add-on',
      '• Base model never changes — you patch a smart 100 MB layer on top',
      '• 4-bit quantization shrinks further — same quality, much less memory',
    ].map((txt,i)=>(
      <Label key={i} start={SS+4.8+i*1.1} end={SE} x={55} y={460+i*52} size={21} font={HAND} color={INK}>{txt}</Label>
    ))}
  </Scene>);
}

// ══ STAGE 3: RL + HF (90–108) ════════════════════════════════════════════════
function Stage3Scene(){
  const SS=90,SE=108;
  const nodes=[
    {x:35, y:205,w:260,h:92,label:'Model drafts\na few answers',    stroke:INK},
    {x:490,y:205,w:280,h:92,label:'Humans rank\n& prefer the best', stroke:INK},
    {x:490,y:448,w:280,h:92,label:'Reward signal\ngenerated',        stroke:AMBER},
    {x:35, y:448,w:260,h:92,label:'Model weights\nupdate',           stroke:GREEN},
  ];
  const nodeT=[SS+0.6,SS+1.6,SS+3.2,SS+4.8];
  const loopArrows=[
    {x1:295,y1:251,x2:490,y2:251,cx:392,cy:205},
    {x1:770,y1:297,x2:770,y2:448,cx:820,cy:372},
    {x1:490,y1:494,x2:295,y2:494,cx:392,cy:540},
    {x1:35, y1:448,x2:35, y2:297,cx:-15,cy:372},
  ];
  const arrowT=[SS+1.4,SS+2.8,SS+4.4,SS+5.8];
  return(<Scene start={SS} end={SE}>
    <Label start={SS+0.2} end={SE} x={42} y={50} size={33} font={HTITLE} weight={700} color={INK}>Stage 3 — Reinforcement Learning + Human Feedback</Label>
    <Label start={SS+0.5} end={SE} x={42} y={90} size={18} font={HAND} color={FADE}>🎓 Like going to school — learning to apply knowledge, reason, and solve new problems</Label>
    {nodes.map((n,i)=>(
      <Draw key={i} start={nodeT[i]} end={SE} dur={0.5}>{(d)=>
        <Box x={n.x} y={n.y} w={n.w} h={n.h} draw={d} stroke={n.stroke} sw={2.8} r={14} labelSize={21}>{n.label}</Box>}
      </Draw>
    ))}
    {loopArrows.map((a,i)=>(
      <Draw key={i} start={arrowT[i]} end={SE} dur={0.5}>{(d)=>
        <Arrow x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} cx={a.cx} cy={a.cy} draw={d} color={FADE} sw={2.5}/>}
      </Draw>
    ))}
    <Label start={SS+7.0} end={SE} x={220} y={340} size={24} font={HTITLE} weight={700} color={FADE} align="center" width={220}>RLHF loop</Label>
    {/* Right column */}
    <Draw start={SS+8.0} end={SE} dur={0.5}>{(d)=>
      <Box x={840} y={148} w={400} h={122} draw={d} stroke={INK} sw={2.5} r={14} labelSize={19} childStyle={{alignItems:'flex-start',padding:'10px 16px'}}>
        <div style={{textAlign:'left'}}>
          <div style={{fontSize:20,fontWeight:600,marginBottom:4}}>Reward Model</div>
          <div style={{fontSize:17,color:FADE}}>A separate model trained to predict human preference scores — "which answer is better?"</div>
        </div>
      </Box>}
    </Draw>
    <Draw start={SS+9.5} end={SE} dur={0.5}>{(d)=>
      <Box x={840} y={284} w={400} h={108} draw={d} stroke={GREEN} fill={LGREEN} sw={2.5} r={14} labelSize={18} childStyle={{alignItems:'flex-start',padding:'10px 16px'}}>
        <div style={{textAlign:'left'}}>
          <div style={{fontSize:18,fontWeight:600,color:GREEN,marginBottom:4}}>DPO — Modern Alternative</div>
          <div style={{fontSize:16,color:FADE}}>Direct Preference Optimization: no separate reward model, train directly on preference pairs. Simpler, more stable.</div>
        </div>
      </Box>}
    </Draw>
    <Draw start={SS+11.0} end={SE} dur={0.55}>{(d)=>
      <Box x={840} y={406} w={400} h={145} draw={d} stroke={GREEN} fill={LGREEN} sw={3} r={16} labelSize={22} childStyle={{alignItems:'flex-start',padding:'12px 16px'}}>
        <div style={{textAlign:'left'}}>
          <div style={{fontSize:22,fontWeight:700,color:GREEN,marginBottom:5}}>More intelligent,{'\n'}aligned model ✓</div>
          <div style={{fontSize:16,color:FADE}}>Safe · helpful · honest · follows instructions · reduced bias &amp; harmful outputs</div>
        </div>
      </Box>}
    </Draw>
    <Draw start={SS+8.0} end={SE} dur={0.4}>{(d)=><Arrow x1={770} y1={300} x2={840} y2={210} draw={d} color={INK} sw={2}/>}</Draw>
    <Label start={SS+13.5} end={SE} x={0} y={628} size={21} font={HAND} align="center" width={VW} color={FADE}>Learns not just what to say — but which answers humans actually prefer, making it safe and aligned</Label>
  </Scene>);
}

// ══ RECAP (108–116) ═══════════════════════════════════════════════════════════
function RecapScene(){
  const SS=126,SE=134;
  const rows=[
    {n:'①',title:'Pre-training',   sub:'Read petabytes of internet → tokenize → train transformer → raw next-token-predicting brain',      color:GREEN},
    {n:'②',title:'Fine-Tuning (SFT)',sub:'Show Q&A examples → base model becomes a helpful assistant · LoRA for your custom domain',         color:AMBER},
    {n:'③',title:'RL + Human Feedback',sub:'Humans rank answers → reward loop → DPO → safer, smarter, aligned model',                         color:INK},
  ];
  return(<Scene start={SS} end={SE}>
    <Label start={SS+0.2} end={SE} x={0} y={55} size={52} font={HTITLE} weight={700} align="center" width={VW} color={INK}>Three stages, one assistant.</Label>
    <Draw start={SS+0.8} end={SE} dur={0.55}>{(d)=><Squiggle x={290} y={115} len={700} draw={d} color={GREEN} sw={4}/>}</Draw>
    {rows.map((r,i)=>(
      <Draw key={i} start={SS+1.3+i*1.0} end={SE} dur={0.55}>{(d)=>
        <Box x={90} y={150+i*160} w={1100} h={132} draw={d} stroke={r.color} fill={i===0?LGREEN:'none'} sw={2.8} r={18} labelSize={22} childStyle={{justifyContent:'flex-start',padding:'14px 22px'}}>
          <div style={{display:'flex',alignItems:'center',gap:18,textAlign:'left'}}>
            <div style={{fontSize:46,fontFamily:HTITLE,fontWeight:700,color:r.color,minWidth:52}}>{r.n}</div>
            <div>
              <div style={{fontSize:25,fontWeight:600,color:r.color,lineHeight:1.1}}>{r.title}</div>
              <div style={{fontSize:18,color:FADE,marginTop:4}}>{r.sub}</div>
            </div>
          </div>
        </Box>}
      </Draw>
    ))}
    <Label start={SS+5.5} end={SE} x={0} y={644} size={20} font={HAND} align="center" width={VW} color={FADE}>Raw text → tokens → a brain → an assistant → an aligned model</Label>
  </Scene>);
}

// ══ INFERENCE (108–126) ══════════════════════════════════════════════════════
function InferenceScene(){
  const SS=108,SE=126;
  const qToks=['What','is','the','capital','of','France','?'];
  return(<Scene start={SS} end={SE}>
    <Label start={SS+0.2} end={SE} x={42} y={22} size={33} font={HTITLE} weight={700} color={GREEN}>④ Inference — the model answers your question</Label>
    <Label start={SS+0.5} end={SE} x={42} y={65} size={18} font={HAND} color={FADE}>🧠 Like an exam — you recall learned patterns, no database lookup needed</Label>
    {/* User question */}
    <Draw start={SS+0.9} end={SE} dur={0.5}>{(d)=>
      <Box x={35} y={92} w={595} h={62} draw={d} stroke={GREEN} fill={LGREEN} sw={2.5} r={12} labelSize={21}
           childStyle={{justifyContent:'flex-start',padding:'0 18px'}}>
        <div><span style={{color:FADE,fontSize:17}}>User: </span><b style={{fontSize:20}}>"What is the capital of France?"</b></div>
      </Box>}
    </Draw>
    <Draw start={SS+1.6} end={SE} dur={0.4}>{(d)=><Arrow x1={332} y1={154} x2={332} y2={184} draw={d} color={FADE} sw={2.5}/>}</Draw>
    <Label start={SS+1.8} end={SE} x={36} y={170} size={15} font={HAND} color={FADE}>Tokenize (same BPE tokenizer from training):</Label>
    {/* Token boxes */}
    {qToks.map((tok,i)=>(
      <Draw key={i} start={SS+2.1+i*0.2} end={SE} dur={0.4}>{(d)=>
        <Box x={35+i*87} y={190} w={78} h={48} draw={d} stroke={AMBER} fill={LAMBER} sw={2.2} r={9} labelSize={16}>{tok}</Box>}
      </Draw>
    ))}
    {/* Embedding section */}
    <Draw start={SS+3.9} end={SE} dur={0.4}>{(d)=><Arrow x1={332} y1={238} x2={332} y2={265} draw={d} color={FADE} sw={2.5}/>}</Draw>
    <Label start={SS+4.1} end={SE} x={36} y={252} size={15} font={HAND} color={FADE}>Each token → embedding vector (from pre-training weights):</Label>
    <Draw start={SS+4.4} end={SE} dur={0.55}>{(d)=>
      <Box x={35} y={272} w={600} h={182} draw={d} stroke={AMBER} fill={LAMBER} sw={2.3} r={14} labelSize={18}
           childStyle={{alignItems:'flex-start',padding:'10px 16px'}}>
        <div style={{textAlign:'left',width:'100%'}}>
          <div style={{fontFamily:MONO,fontSize:13,color:FADE,marginBottom:5}}>Token      │ Dim1  │ Dim2  │ … (real: 4,096+ dimensions)</div>
          <div style={{fontFamily:MONO,fontSize:15,marginBottom:3}}>
            <span style={{color:AMBER}}>"capital" </span><span style={{color:FADE}}>│</span><span style={{color:GREEN}}> 0.64  </span><span style={{color:FADE}}>│</span><span style={{color:GREEN}}> 0.72  </span><span style={{color:FADE}}> ← geographical/admin concept</span>
          </div>
          <div style={{fontFamily:MONO,fontSize:15,marginBottom:3}}>
            <span style={{color:AMBER}}>"France"  </span><span style={{color:FADE}}>│</span><span style={{color:GREEN}}> 0.90  </span><span style={{color:FADE}}>│</span><span style={{color:GREEN}}> 0.20  </span><span style={{color:FADE}}> ← European country</span>
          </div>
          <div style={{fontFamily:MONO,fontSize:15,marginBottom:8}}>
            <span style={{color:FADE}}>"?"       │  0.15  │  0.08  ← question signal</span>
          </div>
          <div style={{fontSize:14,color:FADE}}>2D simplified — real LLMs: 4,096–8,192 dimensions per token</div>
        </div>
      </Box>}
    </Draw>
    {/* Right: cosine similarity */}
    <Draw start={SS+7.2} end={SE} dur={0.6}>{(d)=>
      <Box x={662} y={92} w={582} h={148} draw={d} stroke={GREEN} fill={LGREEN} sw={2.8} r={14} labelSize={19}
           childStyle={{alignItems:'flex-start',padding:'10px 16px'}}>
        <div style={{textAlign:'left'}}>
          <div style={{fontSize:20,fontWeight:600,color:GREEN,marginBottom:5}}>Attention: cosine similarity matching</div>
          <div style={{fontSize:16,color:FADE,marginBottom:4}}>Query vector × Trained weight matrices → similarity score for each learned concept</div>
          <div style={{fontFamily:MONO,fontSize:14,color:FADE,marginBottom:3}}>cos_sim(A,B) = (A·B) / (|A|×|B|)  → 1.0=identical</div>
          <div style={{fontSize:14,color:GREEN}}>Example: "France"[0.90,0.20] · W_Paris[0.88,0.25] ≈ 0.97 ✓</div>
        </div>
      </Box>}
    </Draw>
    <Label start={SS+8.2} end={SE} x={662} y={252} size={18} font={HAND} weight={600} color={INK}>Similarity scores (logits → softmax → probabilities):</Label>
    {[
      {label:'Paris', barMaxW:218,score:'0.97',prob:'58%',color:GREEN},
      {label:'Lyon',  barMaxW: 90,score:'0.71',prob:'15%',color:FADE},
      {label:'Berlin',barMaxW: 72,score:'0.65',prob:'10%',color:FADE},
      {label:'London',barMaxW: 56,score:'0.58',prob: '8%',color:FADE},
      {label:'Nice',  barMaxW: 44,score:'0.52',prob: '5%',color:FADE},
    ].map((b,i)=>(
      <Draw key={i} start={SS+8.7+i*0.5} end={SE} dur={0.5}>{(d)=>
        <LogitBar x={662} y={278+i*40} label={b.label} barMaxW={b.barMaxW} score={b.score} prob={b.prob} color={b.color} draw={d}/>}
      </Draw>
    ))}
    <Label start={SS+11.5} end={SE} x={662} y={484} size={28} font={HTITLE} weight={700} color={GREEN}>→ Sampled: 'Paris' ✓</Label>
    <Label start={SS+12.5} end={SE} x={662} y={526} size={18} font={HAND} weight={600} color={AMBER}>Why same question → different answers?</Label>
    {[
      '• T=0.3 → always "Paris" (near-deterministic)',
      '• T=1.2 → "The capital of France is Paris" or "Paris, famously…"',
      '• Different random seed each call → varied phrasing, same underlying knowledge',
    ].map((line,i)=>(
      <Label key={i} start={SS+13.0+i*0.5} end={SE} x={662} y={553+i*28} size={16} font={HAND} color={FADE}>{line}</Label>
    ))}
    <Label start={SS+15.0} end={SE} x={0} y={628} size={20} font={HAND} align="center" width={VW} color={INK} weight={600}>Answer encoded in weight patterns from training — not a lookup table, a probabilistic brain</Label>
    <Label start={SS+15.5} end={SE} x={0} y={658} size={16} font={HAND} align="center" width={VW} color={FADE}>🔗 See the full transformer architecture interactively: bbycroft.net/llm</Label>
  </Scene>);
}

// ══ ROOT ══════════════════════════════════════════════════════════════════════
function LLMVideo(){
  return(
    <Stage width={VW} height={VH} duration={134} background="#f5f2e8" loop={false} autoplay={true} persistKey="llmvideo3">
      <SketchDefs/>
      <Paper/>
      <TitleScene/>
      <RoadmapScene/>
      <TopBar start={7.2} end={132}/>
      <LLMDefScene/>
      <DataCompaniesScene/>
      <Stage1MainScene/>
      <TokenScene/>
      <Stage2aScene/>
      <RagVsFtScene/>
      <Stage2bScene/>
      <Stage3Scene/>
      <InferenceScene/>
      <RecapScene/>
    </Stage>
  );
}

window.LLMVideo = LLMVideo;
