import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { product } from "@/data/product";
import type { Purchase } from "@/hooks/usePurchase";
import { cn } from "@/utils/cn";

/** Barra de compra fija en móvil/tablet: aparece al dejar atrás el panel de compra. */
export function MobileBar({ purchase }: { purchase: Purchase }) {
  const { size, status, addToBag } = purchase;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const panel = document.getElementById("buy-panel");
    if (!panel) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    io.observe(panel);
    return () => io.disconnect();
  }, []);

  const handle = () => {
    const ok = addToBag();
    if (!ok) {
      document.getElementById("buy-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-steel bg-asphalt/90 backdrop-blur-md transition-transform duration-300 xl:hidden",
        visible ? "translate-y-0" : "translate-y-full"
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-3 sm:px-6">
        <div className="min-w-0 flex-1">
          <p className="wide truncate font-display text-[13px] font-black uppercase tracking-[0.1em]">
            Asym Track JKT <span className="text-signal">/01</span>
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
            {product.price} € · {size ? `Talla ${size}` : "Elige talla"}
          </p>
        </div>
        <button
          type="button"
          onClick={handle}
          className={cn(
            "wide flex h-12 items-center gap-2 px-5 font-display text-[12px] font-black uppercase tracking-[0.18em] text-chalk transition-colors",
            status === "added" ? "bg-navy-mid" : "bg-signal active:bg-signal-deep"
          )}
        >
          {status === "added" ? (
            <>
              <Check size={15} strokeWidth={2.5} /> En la bolsa
            </>
          ) : (
            "Add to bag"
          )}
        </button>
      </div>
    </div>
  );
}
