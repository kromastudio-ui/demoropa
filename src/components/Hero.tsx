import { useState } from "react";
import { product, tabs } from "@/data/product";
import type { Purchase } from "@/hooks/usePurchase";
import { BuyPanel } from "@/components/BuyPanel";
import { JacketViewer, type HotspotRequest } from "@/components/JacketViewer";
import { Label } from "@/components/ui/Tech";
import { cn } from "@/utils/cn";

export function Hero({
  purchase,
  hotspotRequest,
  onGoToDetail,
}: {
  purchase: Purchase;
  hotspotRequest: HotspotRequest | null;
  onGoToDetail: (id: string) => void;
}) {
  const [tab, setTab] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === tab) ?? tabs[0];

  return (
    <section id="hero" className="bg-grid-tech relative overflow-hidden bg-asphalt">
      {/* Glow de fondo (navy + un toque rojo) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-navy-glow/25 blur-[150px]" />
        <div className="absolute left-[56%] top-[66%] h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/15 blur-[120px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-asphalt to-transparent" />
      </div>

      {/* Texto vertical decorativo */}
      <div
        className="pointer-events-none absolute left-3 top-1/2 hidden -translate-y-1/2 -rotate-180 font-mono text-[10px] uppercase tracking-[0.3em] text-smoke [writing-mode:vertical-rl] xl:block"
        aria-hidden
      >
        Ficha técnica — {product.ref} — Vista frontal — Escala 1:1
      </div>

      {/*
        Grid:
        - móvil: 1 col → título · imagen · compra · tabs
        - md:    2 cols → [título | imagen] / [tabs | imagen] / [compra ancho completo]
        - xl:    3 cols → [título | imagen | compra] / [tabs | imagen | compra]
      */}
      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-x-6 gap-y-10 px-4 pb-14 pt-8 sm:px-6 md:grid-cols-2 md:gap-x-10 lg:px-10 lg:pt-12 xl:min-h-[calc(100vh-7rem)] xl:grid-cols-[4.7fr_6.5fr_4.4fr] xl:grid-rows-[auto_1fr] xl:gap-x-6 xl:pb-16">
        {/* ─────────── IZQUIERDA (arriba): identidad de la pieza ─────────── */}
        <div className="space-y-7 md:col-start-1 md:row-start-1 xl:pt-4">
          <div
            className="animate-rise flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ash"
            style={{ animationDelay: "40ms" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-signal" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            <span className="text-chalk">{product.drop}</span>
            <span className="text-smoke">—</span>
            <span>{product.series}</span>
            <span className="ml-auto hidden text-smoke sm:inline">Ref. {product.ref}</span>
          </div>

          <h1
            className="wide animate-rise font-display text-[clamp(3.75rem,15vw,7.5rem)] font-black leading-[0.84] tracking-[-0.025em] md:text-[clamp(3.25rem,7.4vw,6.5rem)] xl:text-[clamp(3.75rem,5.85vw,6rem)]"
            style={{ animationDelay: "120ms" }}
          >
            <span className="block">{product.name[0]}</span>
            <span className="text-outline block">{product.name[1]}</span>
            <span className="block">
              {product.name[2]}
              <span className="text-signal">{product.edition}</span>
            </span>
          </h1>

          <Label as="p" className="animate-rise text-[10.5px] text-ash">
            {product.tagline}
          </Label>

          <div className="animate-rise flex flex-wrap items-end gap-x-4 gap-y-1" style={{ animationDelay: "200ms" }}>
            <span className="semi-wide font-display text-4xl font-extrabold tracking-tight tabular-nums">
              {product.price} €
            </span>
            <span className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ash">
              IVA incl. · {product.installments}
            </span>
          </div>

          <p className="animate-rise max-w-md text-[15px] leading-[1.6] text-chalk/85" style={{ animationDelay: "260ms" }}>
            {product.description}
          </p>
        </div>

        {/* ─────────── CENTRO: visor interactivo ─────────── */}
        <div className="relative flex items-center justify-center md:col-start-2 md:row-span-2 md:row-start-1 xl:col-start-2">
          <JacketViewer hotspotRequest={hotspotRequest} onGoToDetail={onGoToDetail} />
        </div>

        {/* ─────────── DERECHA: panel de compra ─────────── */}
        <div className="flex items-center md:col-span-2 md:col-start-1 md:row-start-3 xl:col-span-1 xl:col-start-3 xl:row-span-2 xl:row-start-1">
          <div className="animate-rise w-full md:mx-auto md:max-w-md xl:max-w-none" style={{ animationDelay: "300ms" }}>
            <BuyPanel purchase={purchase} />
          </div>
        </div>

        {/* ─────────── IZQUIERDA (abajo): pestañas fit / material / cuidados / envío ─────────── */}
        <div
          className="animate-rise md:col-start-1 md:row-start-2 md:self-end xl:col-start-1 xl:row-start-2"
          style={{ animationDelay: "340ms" }}
        >
          <div className="flex items-end justify-between border-b border-steel">
            <div role="tablist" aria-label="Información de la prenda" className="flex gap-5">
              {tabs.map((t) => {
                const on = t.id === tab;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "relative pb-2.5 font-mono text-[10px] uppercase tracking-[0.22em] transition-colors",
                      on ? "text-chalk" : "text-smoke hover:text-ash"
                    )}
                  >
                    {t.label}
                    <span
                      className={cn(
                        "absolute -bottom-px left-0 h-px w-full origin-left bg-signal transition-transform duration-300",
                        on ? "scale-x-100" : "scale-x-0"
                      )}
                      aria-hidden
                    />
                  </button>
                );
              })}
            </div>
            <Label className="pb-2.5 text-smoke">Prenda en plano</Label>
          </div>

          <dl key={current.id} role="tabpanel" className="animate-fade-in min-h-[212px] divide-y divide-steel border-b border-steel">
            {current.rows.map((row) => (
              <div
                key={row.k}
                className="grid grid-cols-[84px_1fr] items-baseline gap-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em]"
              >
                <dt className="text-smoke">{row.k}</dt>
                <dd className="text-chalk/90">{row.v}</dd>
              </div>
            ))}
          </dl>

          {/* Colorway */}
          <div className="mt-4 flex items-center gap-3">
            <Label className="text-smoke">Colorway</Label>
            <div className="flex items-center gap-1.5">
              {product.colorway.map((c) => (
                <span
                  key={c.name}
                  title={c.name}
                  className="h-3.5 w-3.5 border border-white/10"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
            <Label className="text-ash">{product.colorway.map((c) => c.name).join(" / ")}</Label>
          </div>
        </div>
      </div>
    </section>
  );
}
