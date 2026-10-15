import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

export interface ViewerFrame {
  /** Puntero suavizado (%) */
  px: number;
  py: number;
  /** Puntero crudo, sin lag (%) — para la lupa */
  tx: number;
  ty: number;
  /** Rotación actual (grados) */
  rx: number;
  ry: number;
  /** Actividad 0..1 (1 = puntero encima) */
  a: number;
  /** Tamaño del visor en px */
  w: number;
  h: number;
}

type Vec = { rx: number; ry: number; s: number; px: number; py: number; dx: number; dy: number; a: number };
const KEYS = ["rx", "ry", "s", "px", "py", "dx", "dy", "a"] as const;

export type GyroState = "unsupported" | "idle" | "on" | "denied";

interface Options {
  maxTilt?: number;
  hoverScale?: number;
  onFrame?: (f: ViewerFrame) => void;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Inclinación 3D + parallax + foco de luz que siguen al puntero (o al giroscopio).
 * Escribe variables CSS en el elemento (--rx --ry --s --dx --dy --px --py --a)
 * con interpolación en requestAnimationFrame; el bucle se detiene solo cuando todo se asienta.
 */
export function useViewer3D<T extends HTMLElement>({ maxTilt = 9, hoverScale = 1.035, onFrame }: Options = {}) {
  const ref = useRef<T>(null);
  const target = useRef<Vec>({ rx: 0, ry: 0, s: 1, px: 50, py: 50, dx: 0, dy: 0, a: 0 });
  const current = useRef<Vec>({ rx: 0, ry: 0, s: 1, px: 50, py: 50, dx: 0, dy: 0, a: 0 });
  const size = useRef({ w: 1, h: 1 });
  const raf = useRef<number | null>(null);
  const tiltOn = useRef(true);
  const reduced = useRef(false);
  const frameCb = useRef(onFrame);
  frameCb.current = onFrame;
  const gyroOff = useRef<(() => void) | null>(null);
  const [gyro, setGyro] = useState<GyroState>("unsupported");

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (window.matchMedia("(pointer: coarse)").matches && "DeviceOrientationEvent" in window) {
      setGyro("idle");
    }
    return () => {
      if (raf.current != null) cancelAnimationFrame(raf.current);
      gyroOff.current?.();
    };
  }, []);

  const tick = useCallback(() => {
    raf.current = null;
    const el = ref.current;
    if (!el) return;
    const c = current.current;
    const t = target.current;
    let moving = false;
    for (const k of KEYS) {
      const d = t[k] - c[k];
      if (Math.abs(d) > 0.0015) {
        c[k] += d * 0.14;
        moving = true;
      } else {
        c[k] = t[k];
      }
    }
    const st = el.style;
    st.setProperty("--rx", `${c.rx.toFixed(2)}deg`);
    st.setProperty("--ry", `${c.ry.toFixed(2)}deg`);
    st.setProperty("--s", c.s.toFixed(4));
    st.setProperty("--px", `${c.px.toFixed(2)}%`);
    st.setProperty("--py", `${c.py.toFixed(2)}%`);
    st.setProperty("--dx", c.dx.toFixed(3));
    st.setProperty("--dy", c.dy.toFixed(3));
    st.setProperty("--a", c.a.toFixed(3));
    /* Mientras el usuario está encima, la flotación CSS se pausa (ver index.css) */
    const activeNow = t.a > 0.5 ? "true" : "false";
    if (el.dataset.active !== activeNow) el.dataset.active = activeNow;
    frameCb.current?.({
      px: c.px,
      py: c.py,
      tx: t.px,
      ty: t.py,
      rx: c.rx,
      ry: c.ry,
      a: c.a,
      w: size.current.w,
      h: size.current.h,
    });
    if (moving) raf.current = requestAnimationFrame(tick);
  }, []);

  const schedule = useCallback(() => {
    if (raf.current == null) raf.current = requestAnimationFrame(tick);
  }, [tick]);

  /** Apunta el visor a un punto normalizado (0..1, 0..1). */
  const aim = useCallback(
    (x: number, y: number, scale = hoverScale) => {
      const t = target.current;
      t.px = x * 100;
      t.py = y * 100;
      t.a = 1;
      if (tiltOn.current && !reduced.current) {
        t.ry = (x - 0.5) * 2 * maxTilt;
        t.rx = -(y - 0.5) * 2 * maxTilt;
        t.dx = (x - 0.5) * 2;
        t.dy = (y - 0.5) * 2;
        t.s = scale;
      } else {
        t.rx = 0;
        t.ry = 0;
        t.dx = 0;
        t.dy = 0;
        t.s = 1;
      }
      schedule();
    },
    [hoverScale, maxTilt, schedule]
  );

  const reset = useCallback(() => {
    const t = target.current;
    t.a = 0;
    t.rx = 0;
    t.ry = 0;
    t.dx = 0;
    t.dy = 0;
    t.s = 1;
    schedule();
  }, [schedule]);

  const fromEvent = useCallback(
    (e: ReactPointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      size.current = { w: r.width, h: r.height };
      aim(clamp((e.clientX - r.left) / r.width, 0, 1), clamp((e.clientY - r.top) / r.height, 0, 1));
    },
    [aim]
  );

  /** Con false, el visor deja de inclinarse (pero sigue midiendo el puntero: lupa, foco). */
  const setTiltEnabled = useCallback(
    (v: boolean) => {
      tiltOn.current = v;
      if (!v) {
        const t = target.current;
        t.rx = 0;
        t.ry = 0;
        t.dx = 0;
        t.dy = 0;
        t.s = 1;
        schedule();
      }
    },
    [schedule]
  );

  const disableGyro = useCallback(() => {
    gyroOff.current?.();
    gyroOff.current = null;
    setGyro("idle");
    reset();
  }, [reset]);

  const enableGyro = useCallback(async () => {
    const DOE = window.DeviceOrientationEvent as unknown as
      | { requestPermission?: () => Promise<string> }
      | undefined;
    try {
      if (DOE && typeof DOE.requestPermission === "function") {
        const res = await DOE.requestPermission();
        if (res !== "granted") {
          setGyro("denied");
          return;
        }
      }
    } catch {
      setGyro("denied");
      return;
    }
    let base: number | null = null;
    const handler = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      if (base == null) base = e.beta;
      const el = ref.current;
      if (el) {
        const r = el.getBoundingClientRect();
        size.current = { w: r.width, h: r.height };
      }
      const gx = clamp(e.gamma / 28, -1, 1);
      const gy = clamp((e.beta - base) / 28, -1, 1);
      aim(0.5 + gx * 0.45, 0.5 + gy * 0.45, 1.02);
    };
    window.addEventListener("deviceorientation", handler);
    gyroOff.current = () => window.removeEventListener("deviceorientation", handler);
    setGyro("on");
  }, [aim]);

  return {
    ref,
    handlers: {
      onPointerMove: fromEvent,
      onPointerDown: fromEvent,
      onPointerLeave: reset,
      onPointerCancel: reset,
    },
    setTiltEnabled,
    gyro,
    enableGyro,
    disableGyro,
    reset,
  };
}
