import { useState } from "react";
import { Layers, Move3D, Plus, Scissors, Wrench } from "lucide-react";
import { specs } from "@/data/product";
import { Label } from "@/components/ui/Tech";
import { cn } from "@/utils/cn";

const icons = [Scissors, Layers, Move3D, Wrench];

export function SpecsStrip() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="specs" className="bg-mesh relative border-y border-steel">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-asphalt/60 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-asphalt/60 to-transparent" aria-hidden />

      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between border-b border-steel/70 py-4">
          <Label as="h2">02 / Specs</Label>
          <Label className="text-smoke">Ficha técnica · ATJ-01 · Rev. 2026</Label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {specs.map((s, i) => {
            const Icon = icons[i];
            const isOpen = open === s.id;
            return (
              <article
                key={s.id}
                className={cn(
                  "group relative border-b border-steel/70 py-8 last:border-b-0 sm:[&:nth-child(odd)]:border-r sm:[&:nth-child(odd)]:pr-6 sm:[&:nth-child(even)]:pl-6 sm:[&:nth-last-child(-n+2)]:border-b-0 xl:border-b-0 xl:border-r xl:px-6 xl:py-12 xl:first:pl-0 xl:last:border-r-0 xl:last:pr-0",
                  isOpen && "bg-white/[0.02]"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-semibold tracking-[0.2em] text-signal">{s.id}</span>
                  <Icon size={16} strokeWidth={1.5} className="text-smoke transition-colors group-hover:text-chalk" />
                </div>

                <h3 className="wide mt-7 font-display text-[15px] font-black uppercase leading-tight tracking-[0.06em] xl:text-base">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-[34ch] text-[13.5px] leading-[1.65] text-ash">{s.body}</p>

                {/* Bloque expandible (animación de altura vía grid-rows) */}
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="mt-3 max-w-[34ch] border-l-2 border-signal pl-3 text-[12.5px] leading-relaxed text-chalk/80">
                      {s.more}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <Label className="text-[9.5px] text-smoke">{s.meta}</Label>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : s.id)}
                    aria-expanded={isOpen}
                    className="flex shrink-0 items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.2em] text-ash transition-colors hover:text-chalk"
                  >
                    <Plus size={12} className={cn("transition-transform duration-300", isOpen && "rotate-45")} />
                    {isOpen ? "Menos" : "Datos"}
                  </button>
                </div>

                <span
                  className="absolute bottom-0 left-0 h-px w-0 bg-signal transition-all duration-500 group-hover:w-full xl:bottom-auto xl:top-0"
                  aria-hidden
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
