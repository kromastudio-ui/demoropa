import { useEffect } from "react";
import { ArrowLeft, ArrowRight, Crosshair, X } from "lucide-react";
import { details } from "@/data/product";
import { useModal } from "@/hooks/useModal";
import { Label } from "@/components/ui/Tech";
import { pad2 } from "@/utils/format";

export function Lightbox({
  index,
  onClose,
  onNav,
  onLocate,
}: {
  index: number | null;
  onClose: () => void;
  onNav: (i: number) => void;
  onLocate: (detailId: string) => void;
}) {
  const open = index !== null;
  useModal(open, onClose);

  useEffect(() => {
    if (index === null) return;
    const n = details.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onNav((index + 1) % n);
      if (e.key === "ArrowLeft") onNav((index - 1 + n) % n);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onNav]);

  if (index === null) return null;

  const n = details.length;
  const d = details[index];
  const prev = details[(index - 1 + n) % n];
  const next = details[(index + 1) % n];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lb-title"
    >
      <div className="animate-fade-in absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />
      <div
        key={d.id}
        className="animate-pop relative grid max-h-full w-full max-w-5xl overflow-y-auto border border-steel bg-graphite md:grid-cols-[1.05fr_1fr]"
      >
        <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[600px]">
          <img src={d.image} alt={`${d.zone}: ${d.title}`} className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute left-4 top-4 border border-chalk/15 bg-asphalt/55 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-chalk/90 backdrop-blur-sm">
            {d.label}
          </span>
        </div>

        <div className="flex flex-col p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <Label>
              Zoom {d.id} / {pad2(n)}
            </Label>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="-mr-2 grid h-9 w-9 place-items-center text-ash transition-colors hover:text-chalk"
            >
              <X size={18} />
            </button>
          </div>

          <h3 id="lb-title" className="wide mt-6 font-display text-[clamp(1.5rem,3vw,2.25rem)] font-black uppercase leading-[0.95]">
            {d.title}
          </h3>
          <p className="mt-5 text-[14px] leading-[1.7] text-ash">{d.body}</p>
          <Label className="mt-5 block text-smoke">{d.meta}</Label>

          <button
            type="button"
            onClick={() => onLocate(d.id)}
            className="mt-8 flex h-12 w-full items-center justify-between border border-steel px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-chalk transition-colors hover:border-signal hover:text-signal"
          >
            <span className="flex items-center gap-2">
              <Crosshair size={14} /> Localizar en la pieza
            </span>
            <ArrowRight size={14} />
          </button>

          <div className="mt-auto grid grid-cols-2 gap-2 pt-8">
            <button
              type="button"
              onClick={() => onNav((index - 1 + n) % n)}
              className="group flex flex-col items-start border border-steel p-3 text-left transition-colors hover:border-ash"
            >
              <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-smoke">
                <ArrowLeft size={11} /> Anterior
              </span>
              <span className="mt-1 w-full truncate font-mono text-[10px] uppercase tracking-[0.12em] text-ash group-hover:text-chalk">
                {prev.zone}
              </span>
            </button>
            <button
              type="button"
              onClick={() => onNav((index + 1) % n)}
              className="group flex flex-col items-end border border-steel p-3 text-right transition-colors hover:border-ash"
            >
              <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-smoke">
                Siguiente <ArrowRight size={11} />
              </span>
              <span className="mt-1 w-full truncate font-mono text-[10px] uppercase tracking-[0.12em] text-ash group-hover:text-chalk">
                {next.zone}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
