import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { ArrowUpRight, Crosshair, Move3D, ScanSearch, Smartphone, X } from "lucide-react";
import { hotspots, product } from "@/data/product";
import { useViewer3D, type ViewerFrame } from "@/hooks/useViewer3D";
import { Corners, Cross, Label } from "@/components/ui/Tech";
import { cn } from "@/utils/cn";

const ZOOM = 2.4;
const LENS = 176;

export interface HotspotRequest {
  id: string;
  n: number;
}

type Mode = "tilt" | "zoom";

export function JacketViewer({
  hotspotRequest,
  onGoToDetail,
}: {
  hotspotRequest: HotspotRequest | null;
  onGoToDetail: (detailId: string) => void;
}) {
  const [mode, setMode] = useState<Mode>("tilt");
  const [showSpots, setShowSpots] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const readRef = useRef<HTMLSpanElement>(null);

  /* Lupa y lectura de coordenadas se actualizan por DOM directo (sin re-render) */
  const onFrame = useCallback((f: ViewerFrame) => {
    if (readRef.current) {
      readRef.current.textContent = `X ${(f.px / 100).toFixed(2)}  Y ${(f.py / 100).toFixed(2)}  R ${
        f.ry >= 0 ? "+" : ""
      }${f.ry.toFixed(1)}°`;
    }
    const lens = lensRef.current;
    if (!lens) return;
    const x = (f.tx / 100) * f.w;
    const y = (f.ty / 100) * f.h;
    lens.style.transform = `translate(${(x - LENS / 2).toFixed(1)}px, ${(y - LENS / 2).toFixed(1)}px)`;
    lens.style.backgroundSize = `${f.w * ZOOM}px ${f.h * ZOOM}px`;
    lens.style.backgroundPosition = `${(LENS / 2 - x * ZOOM).toFixed(1)}px ${(LENS / 2 - y * ZOOM).toFixed(1)}px`;
  }, []);

  const { ref, handlers, setTiltEnabled, gyro, enableGyro, disableGyro } = useViewer3D<HTMLDivElement>({
    onFrame,
  });

  /* Solo inclina en modo 3D y sin un punto abierto (así el popover se lee quieto) */
  useEffect(() => {
    setTiltEnabled(mode === "tilt" && active === null);
  }, [mode, active, setTiltEnabled]);

  /* Petición externa: "Localizar en la pieza" desde el lightbox */
  useEffect(() => {
    if (!hotspotRequest) return;
    setMode("tilt");
    setShowSpots(true);
    setActive(hotspotRequest.id);
  }, [hotspotRequest]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActive(null);
        setMode("tilt");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onRootClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    const t = e.target as HTMLElement;
    if (t.closest("[data-hotspot]") || t.closest("[data-toolbar]")) return;
    setActive(null);
  };

  const spotsVisible = showSpots && mode === "tilt";

  return (
    <div
      id="viewer"
      ref={ref}
      {...handlers}
      onClick={onRootClick}
      className={cn(
        "relative aspect-[1200/1097] w-full max-w-[720px] select-none [touch-action:pan-y]",
        mode === "zoom" ? "cursor-none" : "cursor-crosshair"
      )}
    >
      {/* ── Marco técnico (fijo, no gira) ── */}
      <Corners size="lg" className="inset-2 sm:inset-0" />
      <Cross className="left-1/2 top-0 -translate-x-1/2 -translate-y-1/2" />
      <Cross className="bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2" />
      <Cross className="left-0 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      <Cross className="right-0 top-1/2 -translate-y-1/2 translate-x-1/2" />
      <div
        className="animate-scan pointer-events-none absolute inset-x-6 h-px bg-gradient-to-r from-transparent via-navy-glow/70 to-transparent"
        aria-hidden
      />
      <Label className="absolute left-4 top-4 z-20 sm:left-3 sm:top-3">
        Fig. 01 — Vista frontal <span className="hidden text-smoke sm:inline">· 320 g/m²</span>
      </Label>
      <Label className="absolute right-4 top-4 z-20 text-chalk sm:right-3 sm:top-3">{product.ref}</Label>

      {/* ── Plano 3D: flota (CSS) → se inclina (JS). El lighten funde el fondo de la foto con la página ── */}
      <div className="animate-float absolute inset-0 mix-blend-lighten">
        <div className="tilt-plane absolute inset-0">
          <img
            src={product.image}
            alt="ASYM TRACK JKT /01 — chaqueta deportiva cropped blanca con paneles navy y rojo, cierre asimétrico"
            className="mask-fade-radial parallax-sm absolute inset-0 h-full w-full object-contain"
            draggable={false}
          />
          <div className="spot-glow pointer-events-none absolute inset-0" aria-hidden />
          <div className="spot-sheen pointer-events-none absolute inset-0" aria-hidden />

          {/* Hotspots */}
          <div
            className={cn(
              "parallax-lg absolute inset-0 transition-opacity duration-300",
              spotsVisible ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            {hotspots.map((h) => {
              const isOn = h.id === active;
              const toRight = h.x < 50;
              const vAlign = h.y > 70 ? "bottom-0" : h.y < 22 ? "top-0" : "top-1/2 -translate-y-1/2";
              return (
                <div key={h.id} className="absolute" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
                  <button
                    type="button"
                    data-hotspot
                    aria-label={`Punto ${h.id}: ${h.title}`}
                    aria-expanded={isOn}
                    tabIndex={spotsVisible ? 0 : -1}
                    onClick={() => setActive(isOn ? null : h.id)}
                    className="group relative -ml-3.5 -mt-3.5 grid h-7 w-7 cursor-pointer place-items-center"
                  >
                    <span
                      className={cn("absolute inset-0 rounded-full border border-signal/70", !isOn && "animate-ping-ring")}
                      aria-hidden
                    />
                    <span
                      className={cn(
                        "absolute inset-0 rounded-full border bg-asphalt/70 transition-colors",
                        isOn ? "border-chalk" : "border-signal/60 group-hover:border-chalk"
                      )}
                      aria-hidden
                    />
                    <span
                      className={cn(
                        "relative block h-2 w-2 transition-transform duration-200",
                        isOn ? "rotate-45 bg-chalk" : "rounded-full bg-signal group-hover:scale-125"
                      )}
                      aria-hidden
                    />
                    <span className="absolute -right-2 -top-2 font-mono text-[8px] leading-none text-ash">
                      {h.id}
                    </span>
                  </button>

                  {isOn && (
                    <div
                      role="dialog"
                      aria-label={h.title}
                      data-hotspot
                      className={cn(
                        "animate-pop absolute z-30 w-[236px] cursor-auto border border-steel-light bg-graphite p-4",
                        vAlign,
                        toRight ? "left-6" : "right-6"
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "absolute h-px w-4 bg-steel-light",
                          h.y > 70 ? "bottom-3" : h.y < 22 ? "top-3" : "top-1/2 -translate-y-1/2",
                          toRight ? "-left-4" : "-right-4"
                        )}
                      />
                      <div className="flex items-start justify-between gap-3">
                        <Label className="text-signal">Punto {h.id}</Label>
                        <button
                          type="button"
                          onClick={() => setActive(null)}
                          aria-label="Cerrar"
                          className="-mr-1 -mt-1 grid h-6 w-6 cursor-pointer place-items-center text-ash hover:text-chalk"
                        >
                          <X size={13} />
                        </button>
                      </div>
                      <h4 className="wide mt-2 font-display text-[13px] font-black uppercase leading-tight">
                        {h.title}
                      </h4>
                      <p className="mt-2 text-[12px] leading-relaxed text-ash">{h.body}</p>
                      <button
                        type="button"
                        onClick={() => onGoToDetail(h.detail)}
                        className="mt-3 flex cursor-pointer items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-chalk transition-colors hover:text-signal"
                      >
                        Ver detalle <ArrowUpRight size={12} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Lupa (modo zoom) ── */}
      {mode === "zoom" && (
        <div
          ref={lensRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-30 rounded-full border border-chalk/40 bg-asphalt bg-no-repeat will-change-transform"
          style={{
            width: LENS,
            height: LENS,
            backgroundImage: `url(${product.image})`,
            opacity: "var(--a, 0)",
          }}
        >
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-signal/40" />
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-signal/40" />
          <span className="absolute inset-[22%] rounded-full border border-chalk/20" />
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.2em] text-chalk/80">
            {ZOOM.toFixed(1)}×
          </span>
        </div>
      )}

      {/* ── Toolbar ── */}
      <div
        data-toolbar
        className="absolute bottom-3 left-3 z-20 flex items-stretch divide-x divide-steel border border-steel bg-asphalt/85 font-mono text-[10px] uppercase tracking-[0.18em] backdrop-blur-sm"
        role="toolbar"
        aria-label="Controles del visor"
      >
        <ToolButton active={mode === "tilt"} onClick={() => setMode("tilt")} icon={<Move3D size={12} />} label="3D" />
        <ToolButton
          active={mode === "zoom"}
          onClick={() => {
            setMode((m) => (m === "zoom" ? "tilt" : "zoom"));
            setActive(null);
          }}
          icon={<ScanSearch size={12} />}
          label="Zoom"
        />
        <ToolButton
          active={showSpots}
          onClick={() => {
            setShowSpots((v) => !v);
            setActive(null);
          }}
          icon={<Crosshair size={12} />}
          label="Puntos"
          badge={hotspots.length}
        />
        {gyro !== "unsupported" && (
          <ToolButton
            active={gyro === "on"}
            onClick={() => (gyro === "on" ? disableGyro() : void enableGyro())}
            icon={<Smartphone size={12} />}
            label={gyro === "denied" ? "Sin giro" : "Giro"}
          />
        )}
      </div>

      {/* ── Lectura de coordenadas ── */}
      <span
        ref={readRef}
        className="pointer-events-none absolute bottom-3 right-3 z-20 hidden whitespace-pre font-mono text-[10px] tabular-nums tracking-[0.16em] text-smoke sm:block"
      >
        {"X 0.50  Y 0.50  R +0.0°"}
      </span>
    </div>
  );
}

function ToolButton({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex cursor-pointer items-center gap-1.5 px-3 py-2 transition-colors",
        active ? "bg-chalk text-asphalt" : "text-ash hover:text-chalk"
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      {badge != null && (
        <span className={cn("ml-0.5 text-[9px]", active ? "text-signal-deep" : "text-signal")}>{badge}</span>
      )}
    </button>
  );
}
