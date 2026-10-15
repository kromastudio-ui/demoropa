import { Search, ShoppingBag, User } from "lucide-react";
import { announcement } from "@/data/product";
import { cn } from "@/utils/cn";

const links = [
  { label: "Drops", active: true },
  { label: "Archivo" },
  { label: "Tech" },
  { label: "Ayuda" },
];

export function Nav({ bagCount, onOpenCart }: { bagCount: number; onOpenCart: () => void }) {
  return (
    <header className="sticky top-0 z-40">
      {/* Announcement strip */}
      <div className="border-b border-navy-mid/60 bg-navy text-chalk/85">
        <div className="mx-auto flex max-w-[1600px] items-center justify-center overflow-hidden px-4 py-1.5">
          <ul className="flex items-center gap-6 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em]">
            {announcement.map((item, i) => (
              <li key={item} className={cn("flex items-center gap-6", i > 0 && "hidden md:flex")}>
                {i > 0 && <span className="h-1 w-1 rounded-full bg-signal" aria-hidden />}
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-steel bg-asphalt/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <a href="#" className="group flex items-center gap-3" aria-label="Asfalto — inicio">
            <span className="grid h-7 w-7 place-items-center bg-chalk transition-colors group-hover:bg-signal">
              <span className="h-2.5 w-2.5 bg-asphalt" />
            </span>
            <span className="wide font-display text-base font-black tracking-tight">
              ASFALTO<sup className="ml-0.5 text-[9px] font-semibold text-ash">®</sup>
            </span>
          </a>

          <nav className="hidden h-16 items-stretch gap-8 md:flex" aria-label="Principal">
            {links.map((l) => (
              <a
                key={l.label}
                href="#"
                className={cn(
                  "relative flex items-center font-mono text-[11px] uppercase tracking-[0.22em] transition-colors hover:text-chalk",
                  l.active ? "text-chalk" : "text-ash"
                )}
              >
                {l.label}
                {l.active && (
                  <span className="absolute bottom-0 left-0 h-px w-full bg-signal" aria-hidden />
                )}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              className="grid h-10 w-10 place-items-center text-ash transition-colors hover:text-chalk"
              aria-label="Buscar"
            >
              <Search size={17} strokeWidth={1.75} />
            </button>
            <button
              className="hidden h-10 w-10 place-items-center text-ash transition-colors hover:text-chalk sm:grid"
              aria-label="Cuenta"
            >
              <User size={17} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={onOpenCart}
              className="relative grid h-10 w-10 cursor-pointer place-items-center text-chalk transition-colors hover:text-signal"
              aria-label={`Bolsa, ${bagCount} ${bagCount === 1 ? "artículo" : "artículos"}`}
            >
              <ShoppingBag size={17} strokeWidth={1.75} />
              <span
                key={bagCount}
                className={cn(
                  "absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full px-1 font-mono text-[9px] font-bold tabular-nums transition-colors",
                  bagCount > 0 ? "animate-rise bg-signal text-chalk" : "bg-steel text-ash"
                )}
              >
                {bagCount}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
