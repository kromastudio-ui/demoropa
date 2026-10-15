import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

/** Esquinas tipo bracket de interfaz técnica. */
export function Corners({
  className,
  size = "md",
  color = "border-steel-light",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
}) {
  const dim = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-6 w-6" : "h-4 w-4";
  const base = cn("pointer-events-none absolute", dim, color);
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
      <span className={cn(base, "left-0 top-0 border-l border-t")} />
      <span className={cn(base, "right-0 top-0 border-r border-t")} />
      <span className={cn(base, "bottom-0 left-0 border-b border-l")} />
      <span className={cn(base, "bottom-0 right-0 border-b border-r")} />
    </div>
  );
}

/** Etiqueta monoespaciada en mayúsculas, estilo ficha técnica. */
export function Label({
  children,
  className,
  as: Tag = "span",
}: {
  children: ReactNode;
  className?: string;
  as?: "span" | "p" | "div" | "h2" | "h3";
}) {
  return (
    <Tag
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.22em] text-ash",
        className
      )}
    >
      {children}
    </Tag>
  );
}

/** Crosshair "+" para marcar puntos en el layout. */
export function Cross({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("pointer-events-none absolute h-3 w-3 text-steel-light", className)}
    >
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
    </span>
  );
}
