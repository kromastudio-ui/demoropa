import { X } from "lucide-react";
import type { ToastItem } from "@/hooks/usePurchase";

export function Toasts({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: number) => void }) {
  return (
    <div
      className="pointer-events-none fixed bottom-24 left-4 z-[80] flex flex-col gap-2 sm:left-6 xl:bottom-6"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-rise pointer-events-auto flex items-center gap-4 border border-steel border-l-2 border-l-signal bg-graphite px-4 py-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-chalk"
        >
          <span>{t.text}</span>
          {t.action && (
            <button
              type="button"
              onClick={() => {
                t.action?.onClick();
                onDismiss(t.id);
              }}
              className="text-signal transition-colors hover:text-chalk"
            >
              {t.action.label}
            </button>
          )}
          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            aria-label="Cerrar aviso"
            className="text-smoke transition-colors hover:text-chalk"
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}
