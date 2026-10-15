import { useCallback, useState } from "react";
import { ArrowRight, Check, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { product, shop } from "@/data/product";
import type { Purchase } from "@/hooks/usePurchase";
import { useModal } from "@/hooks/useModal";
import { Label } from "@/components/ui/Tech";
import { euro, pad2 } from "@/utils/format";
import { cn } from "@/utils/cn";

type Checkout = "idle" | "processing" | "done";

export function CartDrawer({ purchase }: { purchase: Purchase }) {
  const { cartOpen, closeCart, items, updateItem, removeItem, clearBag, subtotal, bagCount } = purchase;
  const [checkout, setCheckout] = useState<Checkout>("idle");
  const [orderId, setOrderId] = useState("");

  const handleClose = useCallback(() => {
    if (checkout === "done") {
      clearBag();
      setCheckout("idle");
    }
    closeCart();
  }, [checkout, clearBag, closeCart]);

  useModal(cartOpen, handleClose);

  const shipping = subtotal > 0 && subtotal < shop.freeShippingFrom ? shop.shippingCost : 0;
  const missing = Math.max(0, shop.freeShippingFrom - subtotal);
  const progress = Math.min(100, Math.round((subtotal / shop.freeShippingFrom) * 100));

  const placeOrder = () => {
    setCheckout("processing");
    window.setTimeout(() => {
      setOrderId(`ATJ-${Math.floor(1000 + Math.random() * 9000)}`);
      setCheckout("done");
    }, 1400);
  };

  const goChoose = () => {
    closeCart();
    document.getElementById("buy-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className={cn("fixed inset-0 z-[60]", !cartOpen && "pointer-events-none")} inert={!cartOpen}>
      <div
        className={cn(
          "absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300",
          cartOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={handleClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Bolsa"
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-steel bg-graphite transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)]",
          cartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-steel px-5">
          <div className="flex items-center gap-3">
            <ShoppingBag size={16} strokeWidth={1.75} />
            <span className="wide font-display text-sm font-black uppercase tracking-[0.12em]">Bolsa</span>
            <span className="font-mono text-[10px] text-ash">({pad2(bagCount)})</span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar bolsa"
            className="grid h-9 w-9 place-items-center text-ash transition-colors hover:text-chalk"
          >
            <X size={18} />
          </button>
        </div>

        {checkout === "done" ? (
          <div className="animate-fade-in flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid h-14 w-14 place-items-center border border-signal text-signal">
              <Check size={24} strokeWidth={2.5} />
            </span>
            <Label className="mt-6 text-signal">Pedido demo</Label>
            <p className="wide mt-2 font-display text-2xl font-black uppercase">#{orderId}</p>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-ash">
              Esto es una demo: no hemos cobrado nada. En producción aquí entraría tu pasarela de pago.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-8 border border-steel px-6 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-chalk transition-colors hover:border-ash"
            >
              Cerrar
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid h-14 w-14 place-items-center border border-steel text-smoke">
              <ShoppingBag size={22} strokeWidth={1.5} />
            </span>
            <p className="wide mt-6 font-display text-xl font-black uppercase">Tu bolsa está vacía.</p>
            <p className="mt-1 text-[13px] text-ash">Arréglalo.</p>
            <button
              type="button"
              onClick={goChoose}
              className="mt-8 flex items-center gap-2 bg-chalk px-6 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-asphalt transition-colors hover:bg-signal hover:text-chalk"
            >
              Elegir talla <ArrowRight size={13} />
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-steel overflow-y-auto px-5">
              {items.map((it) => (
                <li key={it.size} className="animate-rise flex gap-4 py-5">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden border border-steel bg-asphalt">
                    <img
                      src={product.image}
                      alt=""
                      className="absolute inset-0 h-full w-full scale-[1.7] object-contain object-[50%_38%]"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="wide font-display text-[13px] font-black uppercase leading-tight">
                          Asym Track JKT <span className="text-signal">/01</span>
                        </p>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
                          Talla {it.size} · Chalk/Navy/Signal
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(it.size)}
                        aria-label={`Quitar talla ${it.size}`}
                        className="text-smoke transition-colors hover:text-signal"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex h-9 items-stretch border border-steel">
                        <button
                          type="button"
                          onClick={() => updateItem(it.size, -1)}
                          aria-label="Una menos"
                          className="grid w-9 place-items-center text-ash transition-colors hover:text-chalk"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="grid w-9 place-items-center border-x border-steel font-mono text-[11px] tabular-nums">
                          {pad2(it.qty)}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateItem(it.size, 1)}
                          disabled={it.qty >= 9}
                          aria-label="Una más"
                          className="grid w-9 place-items-center text-ash transition-colors hover:text-chalk disabled:opacity-30"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="font-mono text-[12px] tabular-nums">{euro(it.qty * product.price)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="shrink-0 border-t border-steel px-5 pb-6 pt-4">
              <div className="mb-4">
                <div className="flex items-center justify-between font-mono text-[9.5px] uppercase tracking-[0.16em] text-ash">
                  <span>{missing > 0 ? `Te faltan ${euro(missing)} para envío gratis` : "Envío gratis desbloqueado"}</span>
                  <span className="tabular-nums">{progress}%</span>
                </div>
                <div className="mt-2 h-1 w-full bg-steel">
                  <div
                    className={cn("h-full transition-all duration-500", missing > 0 ? "bg-signal" : "bg-[#2fbf71]")}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <dl className="space-y-1.5 font-mono text-[11px] uppercase tracking-[0.12em]">
                <div className="flex justify-between text-ash">
                  <dt>Subtotal</dt>
                  <dd className="tabular-nums text-chalk">{euro(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-ash">
                  <dt>Envío</dt>
                  <dd className="tabular-nums text-chalk">{shipping === 0 ? "Gratis" : euro(shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-steel pt-2 text-chalk">
                  <dt className="font-semibold">Total</dt>
                  <dd className="font-semibold tabular-nums">{euro(subtotal + shipping)}</dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={placeOrder}
                disabled={checkout === "processing"}
                className="wide mt-4 flex h-14 w-full items-center justify-between bg-signal px-5 font-display text-[13px] font-black uppercase tracking-[0.18em] text-chalk transition-colors hover:bg-signal-deep disabled:cursor-wait disabled:opacity-80"
              >
                <span>{checkout === "processing" ? "Procesando…" : "Tramitar pedido"}</span>
                {checkout === "processing" ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-chalk/30 border-t-chalk" />
                ) : (
                  <ArrowRight size={16} strokeWidth={2.25} />
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="mt-2 w-full py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ash transition-colors hover:text-chalk"
              >
                Seguir mirando
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
