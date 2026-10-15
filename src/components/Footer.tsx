import { marquee } from "@/data/product";

export function Footer() {
  const items = [...marquee, ...marquee];
  return (
    <footer className="border-t border-steel">
      {/* Marquee */}
      <div className="mask-fade-x overflow-hidden border-b border-steel bg-navy py-3">
        <div className="animate-marquee flex w-max items-center gap-10 pr-10">
          {[...items, ...items].map((item, i) => (
            <span key={`${item}-${i}`} className="flex items-center gap-10 whitespace-nowrap">
              <span className="wide font-display text-[13px] font-black uppercase tracking-[0.22em] text-chalk/80">
                {item}
              </span>
              <span className="h-1.5 w-1.5 rotate-45 bg-signal" aria-hidden />
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-8 font-mono text-[10px] uppercase tracking-[0.2em] text-smoke sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <span>
          <span className="text-ash">Asfalto®</span> — Hecho para la calle. Probado en la pista.
        </span>
        <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Legal">
          {["Envíos", "Devoluciones", "Privacidad", "© 2026"].map((l) => (
            <a key={l} href="#" className="transition-colors hover:text-chalk">
              {l}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
