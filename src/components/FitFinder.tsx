import { useState } from "react";
import { Check, X } from "lucide-react";
import { SIZE_ORDER, fitFinder, product, type SizeId } from "@/data/product";
import { useModal } from "@/hooks/useModal";
import { Corners, Label } from "@/components/ui/Tech";
import { cn } from "@/utils/cn";

type Pref = "ajustado" | "foto" | "oversize";

const prefs: { id: Pref; label: string }[] = [
  { id: "ajustado", label: "Ajustado" },
  { id: "foto", label: "Como en la foto" },
  { id: "oversize", label: "Más oversize" },
];

/** Heurística orientativa: altura/peso → índice de talla, con sesgo según preferencia de fit. */
export function recommendSize(height: number, weight: number, pref: Pref): SizeId {
  const adj = pref === "ajustado" ? -0.55 : pref === "oversize" ? 0.6 : 0;
  const idx = 0.8 + (height - 165) / 18 + (weight - 55) / 18 + adj;
  return SIZE_ORDER[Math.round(Math.min(4, Math.max(0, idx)))];
}

export function FitFinder({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (s: SizeId) => void;
}) {
  const [height, setHeight] = useState(172);
  const [weight, setWeight] = useState(66);
  const [pref, setPref] = useState<Pref>("foto");
  useModal(open, onClose);

  if (!open) return null;

  const size = recommendSize(height, weight, pref);
  const row = product.sizes.find((s) => s.id === size) ?? product.sizes[2];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fit-title"
    >
      <div className="animate-fade-in absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-pop relative w-full max-w-lg border border-steel bg-graphite p-6 sm:p-8">
        <Corners size="sm" />
        <div className="flex items-start justify-between">
          <Label className="text-signal">Fit finder · {product.ref}</Label>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="-mr-2 -mt-2 grid h-8 w-8 place-items-center text-ash transition-colors hover:text-chalk"
          >
            <X size={16} />
          </button>
        </div>
        <h3 id="fit-title" className="wide mt-3 font-display text-2xl font-black uppercase leading-none">
          {fitFinder.title}
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-ash">{fitFinder.intro}</p>

        <div className="mt-6 space-y-5">
          <Slider label="Altura" value={height} min={150} max={200} unit="cm" onChange={setHeight} />
          <Slider label="Peso" value={weight} min={45} max={110} unit="kg" onChange={setWeight} />
          <div>
            <Label className="mb-2 block">Cómo la quieres</Label>
            <div className="grid grid-cols-3 gap-1.5">
              {prefs.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPref(p.id)}
                  aria-pressed={pref === p.id}
                  className={cn(
                    "h-10 border px-1 font-mono text-[9.5px] uppercase tracking-[0.12em] transition-colors",
                    pref === p.id
                      ? "border-chalk bg-chalk text-asphalt"
                      : "border-steel text-ash hover:border-ash hover:text-chalk"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div key={size} className="animate-fade-in mt-6 grid grid-cols-[auto_1fr] gap-5 border-l-2 border-signal pl-5">
          <div>
            <Label className="block">Tu talla</Label>
            <span className="wide font-display text-6xl font-black leading-none">{size}</span>
          </div>
          <div className="self-center">
            <p className="text-[13px] leading-relaxed text-chalk/85">{fitFinder.result[pref]}</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-smoke">
              Pecho {row.chest} · Largo {row.length} · Manga {row.sleeve} cm
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            onSelect(size);
            onClose();
          }}
          className="wide mt-6 flex h-14 w-full items-center justify-center gap-2 bg-signal font-display text-[12px] font-black uppercase tracking-[0.18em] text-chalk transition-colors hover:bg-signal-deep"
        >
          <Check size={15} strokeWidth={2.5} />
          Seleccionar {size}
        </button>
        <p className="mt-3 text-center font-mono text-[9.5px] uppercase tracking-[0.16em] text-smoke">
          {fitFinder.footnote}
        </p>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Label>{label}</Label>
        <span className="font-mono text-[12px] tabular-nums text-chalk">
          {value} <span className="text-smoke">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="h-1 w-full cursor-pointer appearance-none bg-steel accent-signal [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-signal [&::-moz-range-thumb]:bg-chalk [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-signal [&::-webkit-slider-thumb]:bg-chalk"
      />
      <div className="mt-1 flex justify-between font-mono text-[9px] text-smoke">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
