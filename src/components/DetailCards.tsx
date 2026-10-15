import { useEffect, useState } from "react";
import { Crosshair, ZoomIn } from "lucide-react";
import { details } from "@/data/product";
import { Label } from "@/components/ui/Tech";
import { cn } from "@/utils/cn";

export interface DetailFlash {
  id: string;
  n: number;
}

export function DetailCards({ onOpen, flash }: { onOpen: (index: number) => void; flash: DetailFlash | null }) {
  const [lit, setLit] = useState<string | null>(null);

  /* Resalta la tarjeta a la que nos envía un hotspot del visor */
  useEffect(() => {
    if (!flash) return;
    setLit(flash.id);
    const t = window.setTimeout(() => setLit(null), 1800);
    return () => window.clearTimeout(t);
  }, [flash]);

  return (
    <section id="detalles" className="relative bg-asphalt py-20 lg:py-28">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Label as="h2">03 / Detalles — Zoom</Label>
            <p className="wide mt-5 font-display text-[clamp(2rem,4.6vw,4.25rem)] font-black uppercase leading-[0.92] tracking-[-0.02em]">
              De lejos, una chaqueta.
              <br />
              <span className="text-outline-ash">De cerca, el motivo.</span>
            </p>
          </div>
          <p className="max-w-sm text-[14px] leading-relaxed text-ash lg:pb-2 lg:text-right">
            Tres zonas donde se decide si una pieza es premium o solo lo parece. Pulsa para ampliar.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3 lg:mt-16">
          {details.map((d, i) => (
            <article
              key={d.id}
              id={`detail-${d.id}`}
              role="button"
              tabIndex={0}
              aria-label={`Ampliar: ${d.title}`}
              onClick={() => onOpen(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpen(i);
                }
              }}
              className={cn(
                "group relative flex cursor-zoom-in flex-col overflow-hidden rounded-2xl border bg-graphite transition-all duration-300 hover:border-steel-light focus:outline-none focus-visible:border-signal",
                lit === d.id ? "border-signal ring-2 ring-signal/40 ring-offset-4 ring-offset-asphalt" : "border-steel"
              )}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={d.image}
                  alt={`${d.zone}: ${d.title}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite via-transparent to-black/20" aria-hidden />

                <span className="absolute left-4 top-4 border border-chalk/15 bg-asphalt/55 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-chalk/90 backdrop-blur-sm">
                  {d.label}
                </span>
                <Crosshair
                  size={18}
                  strokeWidth={1.25}
                  className="absolute right-4 top-4 text-chalk/60 transition-all duration-500 group-hover:rotate-90 group-hover:text-signal"
                />
                <span className="wide absolute bottom-4 left-4 font-display text-5xl font-black text-chalk/10">{d.id}</span>
                <span className="absolute bottom-4 right-4 flex items-center gap-1.5 border border-chalk/15 bg-asphalt/60 px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.2em] text-chalk/80 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <ZoomIn size={11} /> Ampliar
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="wide font-display text-[17px] font-black uppercase leading-tight tracking-[0.04em]">{d.title}</h3>
                <p className="mt-3 text-[13.5px] leading-[1.65] text-ash">{d.body}</p>
                <div className="mt-6 flex items-center justify-between border-t border-steel pt-4">
                  <Label className="text-[9.5px] text-smoke">{d.meta}</Label>
                  <span className={cn("h-1.5 w-1.5 rounded-full bg-signal", lit === d.id && "animate-pulse-dot")} aria-hidden />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
