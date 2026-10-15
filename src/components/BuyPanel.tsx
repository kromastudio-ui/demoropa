import { useCallback, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  Check,
  Minus,
  Plus,
  RefreshCcw,
  Ruler,
  Share2,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { product } from "@/data/product";
import type { Purchase } from "@/hooks/usePurchase";
import { Corners, Label } from "@/components/ui/Tech";
import { FitFinder } from "@/components/FitFinder";
import { euro, pad2 } from "@/utils/format";
import { cn } from "@/utils/cn";

const trustIcons = [Truck, RefreshCcw, ShieldCheck];

export function BuyPanel({ purchase }: { purchase: Purchase }) {
  const { size, selectSize, qty, changeQty, saved, toggleSaved, share, status, shakeKey, addToBag, notify } =
    purchase;
  const [showHowTo, setShowHowTo] = useState(false);
  const [finderOpen, setFinderOpen] = useState(false);
  const closeFinder = useCallback(() => setFinderOpen(false), []);
  const selected = product.sizes.find((s) => s.id === size);
  const total = product.price * qty;

  return (
    <aside
      id="buy-panel"
      className="relative w-full border border-steel bg-graphite/80 p-5 backdrop-blur-sm sm:p-6"
      aria-label="Comprar"
    >
      <Corners size="sm" />

      {/* ── 01 Talla ── */}
      <div className="flex items-center justify-between gap-3">
        <Label>
          01 — Talla
          {selected && <span className="ml-2 text-chalk">· {selected.id}</span>}
        </Label>
        <div className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.16em]">
          <button
            type="button"
            onClick={() => setFinderOpen(true)}
            className="flex items-center gap-1.5 text-signal transition-colors hover:text-chalk"
          >
            <Sparkles size={12} strokeWidth={1.75} />
            ¿Qué talla soy?
          </button>
          <span className="text-steel-light" aria-hidden>
            |
          </span>
          <button
            type="button"
            onClick={() => setShowHowTo((v) => !v)}
            aria-expanded={showHowTo}
            className="flex items-center gap-1.5 text-ash transition-colors hover:text-chalk"
          >
            <Ruler size={12} strokeWidth={1.75} />
            {showHowTo ? "Cerrar" : "Medir"}
          </button>
        </div>
      </div>

      <div
        key={shakeKey}
        className={cn("mt-4 grid grid-cols-5 gap-2", status === "error" && "animate-shake")}
        role="radiogroup"
        aria-label="Talla"
      >
        {product.sizes.map((s) => {
          const isSel = s.id === size;
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={isSel}
              onClick={() => selectSize(s.id)}
              className={cn(
                "group relative h-14 border font-display text-sm font-bold tracking-[0.12em] transition-all duration-150",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-graphite",
                isSel
                  ? "border-chalk bg-chalk text-asphalt"
                  : "border-steel bg-asphalt/40 text-chalk hover:border-ash active:scale-[0.97]",
                status === "error" && !isSel && "border-signal/60"
              )}
            >
              {s.id}
              {s.stock === "low" && (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
              )}
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-signal transition-transform duration-200",
                  isSel && "scale-x-100"
                )}
                aria-hidden
              />
            </button>
          );
        })}
      </div>

      <div className="mt-2.5 flex min-h-[16px] items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em]">
        <span className={cn("transition-colors", status === "error" ? "text-signal" : "text-smoke")}>
          {status === "error"
            ? "Elige una talla primero."
            : selected?.note
              ? `${selected.id} — ${selected.note}`
              : "Fit cropped · talla real"}
        </span>
        <span className="flex items-center gap-1.5 text-smoke">
          <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
          L — quedan 2
        </span>
      </div>

      {showHowTo && (
        <ul className="animate-rise mt-4 space-y-1.5 border-l-2 border-signal pl-3 text-[12px] leading-relaxed text-ash">
          {product.howToMeasure.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}

      {/* ── 02 Guía rápida ── */}
      <div className="mt-5">
        <Label className="mb-2 block">02 — Guía rápida</Label>
        <div className="overflow-hidden border border-steel">
          <table className="w-full border-collapse font-mono text-[11px] tabular-nums">
            <thead>
              <tr className="border-b border-steel bg-asphalt/60 text-[9.5px] uppercase tracking-[0.18em] text-smoke">
                <th className="px-3 py-1.5 text-left font-medium">Talla</th>
                <th className="px-3 py-1.5 text-right font-medium">Pecho</th>
                <th className="px-3 py-1.5 text-right font-medium">Largo</th>
                <th className="px-3 py-1.5 text-right font-medium">Manga</th>
              </tr>
            </thead>
            <tbody>
              {product.sizes.map((s) => {
                const isSel = s.id === size;
                return (
                  <tr
                    key={s.id}
                    onClick={() => selectSize(s.id)}
                    className={cn(
                      "cursor-pointer border-b border-steel/60 transition-colors last:border-b-0",
                      isSel ? "bg-navy-mid/50 text-chalk" : "text-ash hover:bg-steel/30 hover:text-chalk"
                    )}
                  >
                    <td className="px-3 py-1 font-semibold">
                      <span className="flex items-center gap-2">
                        <span className={cn("h-1 w-1 rounded-full", isSel ? "bg-signal" : "bg-transparent")} aria-hidden />
                        {s.id}
                      </span>
                    </td>
                    <td className="px-3 py-1 text-right">{s.chest}</td>
                    <td className="px-3 py-1 text-right">{s.length}</td>
                    <td className="px-3 py-1 text-right">{s.sleeve}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2.5 text-[12px] leading-relaxed text-ash">{product.sizeNote}</p>
      </div>

      {/* ── 03 Cantidad · guardar · compartir ── */}
      <div className="mt-5 flex items-center justify-between">
        <Label>03 — Cantidad</Label>
        <Label className="text-smoke">Máx. 9 por pedido</Label>
      </div>
      <div className="mt-2 grid grid-cols-[auto_1fr] gap-2">
        <div className="flex h-12 items-stretch border border-steel">
          <button
            type="button"
            onClick={() => changeQty(-1)}
            disabled={qty <= 1}
            aria-label="Una menos"
            className="grid w-11 place-items-center text-ash transition-colors hover:text-chalk disabled:opacity-30 disabled:hover:text-ash"
          >
            <Minus size={14} />
          </button>
          <span className="grid w-10 place-items-center border-x border-steel font-mono text-[12px] tabular-nums" aria-live="polite">
            {pad2(qty)}
          </span>
          <button
            type="button"
            onClick={() => changeQty(1)}
            disabled={qty >= 9}
            aria-label="Una más"
            className="grid w-11 place-items-center text-ash transition-colors hover:text-chalk disabled:opacity-30 disabled:hover:text-ash"
          >
            <Plus size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={toggleSaved}
            aria-pressed={saved}
            className={cn(
              "flex h-12 items-center justify-center gap-2 border font-mono text-[10px] uppercase tracking-[0.18em] transition-colors",
              saved ? "border-chalk/40 text-chalk" : "border-steel text-ash hover:border-ash hover:text-chalk"
            )}
          >
            <Bookmark size={14} strokeWidth={1.75} className={cn("transition-all", saved && "fill-chalk")} />
            <span className="hidden sm:inline">{saved ? "Guardada" : "Guardar"}</span>
          </button>
          <button
            type="button"
            onClick={() => void share()}
            className="flex h-12 items-center justify-center gap-2 border border-steel font-mono text-[10px] uppercase tracking-[0.18em] text-ash transition-colors hover:border-ash hover:text-chalk"
          >
            <Share2 size={14} strokeWidth={1.75} />
            <span className="hidden sm:inline">Compartir</span>
          </button>
        </div>
      </div>

      {/* ── CTA ── */}
      <button
        type="button"
        onClick={addToBag}
        className={cn(
          "wide group relative mt-2 flex h-14 w-full items-center justify-between overflow-hidden px-5 font-display text-[13px] font-black uppercase tracking-[0.18em] text-chalk transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-chalk focus-visible:ring-offset-2 focus-visible:ring-offset-graphite",
          status === "added" ? "bg-navy-mid" : "bg-signal hover:bg-signal-deep active:bg-signal-deep"
        )}
      >
        {status === "added" ? (
          <>
            <span className="flex items-center gap-2">
              <Check size={16} strokeWidth={2.5} />
              En la bolsa
            </span>
            <span className="font-mono text-[11px] font-medium tracking-[0.1em] text-chalk/70">
              {pad2(qty)} × {selected?.id}
            </span>
          </>
        ) : (
          <>
            <span>Add to bag</span>
            <span className="flex items-center gap-3">
              <span className="font-mono text-[12px] font-medium tracking-[0.05em] tabular-nums">{euro(total)}</span>
              <ArrowRight size={16} strokeWidth={2.25} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </>
        )}
      </button>

      {/* ── Stock + trust ── */}
      <div className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
        <span className="relative flex h-2 w-2">
          <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-[#2fbf71]" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2fbf71]" />
        </span>
        {product.stockLine}
      </div>

      <ul className="mt-4 grid grid-cols-3 divide-x divide-steel border-t border-steel pt-4">
        {product.trust.map((t, i) => {
          const Icon = trustIcons[i];
          return (
            <li
              key={t}
              className="flex items-center justify-center gap-1.5 px-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-smoke"
            >
              <Icon size={12} strokeWidth={1.75} className="shrink-0" />
              <span className="truncate">{t}</span>
            </li>
          );
        })}
      </ul>

      <FitFinder
        open={finderOpen}
        onClose={closeFinder}
        onSelect={(s) => {
          selectSize(s);
          notify(`Talla ${s} seleccionada`);
        }}
      />
    </aside>
  );
}
