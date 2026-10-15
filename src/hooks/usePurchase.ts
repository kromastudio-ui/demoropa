import { useCallback, useEffect, useRef, useState } from "react";
import { product, type SizeId } from "@/data/product";

export type PurchaseStatus = "idle" | "error" | "added";

export interface CartItem {
  size: SizeId;
  qty: number;
}

export interface ToastItem {
  id: number;
  text: string;
  action?: { label: string; onClick: () => void };
}

const MAX_QTY = 9;

export function usePurchase() {
  const [size, setSize] = useState<SizeId | null>(null);
  const [qty, setQty] = useState(1);
  const [saved, setSaved] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [status, setStatus] = useState<PurchaseStatus>("idle");
  const [shakeKey, setShakeKey] = useState(0);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const resetLater = useCallback((ms: number) => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus("idle"), ms);
  }, []);

  /* ── Toasts ── */
  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const notify = useCallback((text: string, action?: ToastItem["action"]) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, text, action }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400);
  }, []);

  /* ── Selección ── */
  const selectSize = useCallback((id: SizeId) => {
    setSize(id);
    setStatus((s) => (s === "error" ? "idle" : s));
  }, []);

  const changeQty = useCallback((delta: number) => {
    setQty((q) => Math.min(MAX_QTY, Math.max(1, q + delta)));
  }, []);

  /* ── Bolsa ── */
  const addToBag = useCallback(() => {
    if (!size) {
      setStatus("error");
      setShakeKey((k) => k + 1);
      resetLater(2400);
      return false;
    }
    setItems((list) => {
      const i = list.findIndex((x) => x.size === size);
      if (i === -1) return [...list, { size, qty }];
      const copy = [...list];
      copy[i] = { ...copy[i], qty: Math.min(MAX_QTY, copy[i].qty + qty) };
      return copy;
    });
    setStatus("added");
    resetLater(2200);
    setCartOpen(true);
    return true;
  }, [size, qty, resetLater]);

  const updateItem = useCallback((s: SizeId, delta: number) => {
    setItems((list) =>
      list
        .map((x) => (x.size === s ? { ...x, qty: Math.min(MAX_QTY, x.qty + delta) } : x))
        .filter((x) => x.qty > 0)
    );
  }, []);

  const removeItem = useCallback((s: SizeId) => {
    setItems((list) => list.filter((x) => x.size !== s));
  }, []);

  const clearBag = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  /* ── Guardar / compartir ── */
  const toggleSaved = useCallback(() => {
    const next = !saved;
    setSaved(next);
    notify(next ? "Guardada en tu lista" : "Quitada de tu lista");
  }, [saved, notify]);

  const share = useCallback(async () => {
    const url = window.location.href;
    const data = {
      title: "ASYM TRACK JKT /01 — ASFALTO®",
      text: "Cremallera fuera de eje, corte cropped. Míratela.",
      url,
    };
    try {
      if (
        typeof navigator.share === "function" &&
        (typeof navigator.canShare !== "function" || navigator.canShare(data))
      ) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(url);
      notify("Enlace copiado al portapapeles");
    } catch (err) {
      if ((err as Error).name !== "AbortError") notify("No se pudo compartir en este navegador");
    }
  }, [notify]);

  const bagCount = items.reduce((n, x) => n + x.qty, 0);
  const subtotal = bagCount * product.price;

  return {
    size,
    selectSize,
    qty,
    changeQty,
    saved,
    toggleSaved,
    share,
    items,
    bagCount,
    subtotal,
    updateItem,
    removeItem,
    clearBag,
    cartOpen,
    openCart,
    closeCart,
    status,
    shakeKey,
    addToBag,
    toasts,
    notify,
    dismissToast,
  };
}

export type Purchase = ReturnType<typeof usePurchase>;
