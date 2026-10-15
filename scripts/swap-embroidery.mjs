#!/usr/bin/env node
/**
 * Sustituye la macro del Zoom 02 (frontal) por TU foto, aplicando el mismo
 * grade cinemático que el resto de las tarjetas.
 *
 * Uso:
 *   node scripts/swap-embroidery.mjs [origen] [destino]
 *
 *   origen   por defecto: public/uploads/embroidery.jpg
 *   destino  por defecto: src/assets/images/detail-embroidery.jpg
 *
 * Pipeline:
 *   1. Recorte a 900×1350 (2:3, formato de las tarjetas) desde el centro.
 *   2. Grade base: curva S de contraste + viñeta radial (esquinas oscuras).
 *   3. Mide la luminancia y reduce en pasadas (×0.85) hasta entrar en la
 *      banda 20–32 %, la misma familia visual que las otras tarjetas.
 *
 * Después:  npm run build
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [srcArg, dstArg] = process.argv.slice(2);
const src = path.resolve(srcArg ?? "public/uploads/embroidery.jpg");
const dst = path.resolve(dstArg ?? "src/assets/images/detail-embroidery.jpg");

const run = (args) => {
  const r = spawnSync("convert", args, { encoding: "utf8" });
  if (r.status !== 0) {
    console.error("convert falló:", (r.stderr ?? "").trim() || r.error?.message);
    process.exit(1);
  }
  return r.stdout.trim();
};

if (!fs.existsSync(src)) {
  console.error(`✘ No encuentro la foto en: ${src}`);
  console.error('  Cópiala a "public/uploads/embroidery.jpg" o pásala como primer argumento.');
  process.exit(1);
}

const id = run([src, "-format", "%wx%h", "info:"]);
console.log(`Fuente: ${src} (${id})`);

const W = 900;
const H = 1350;
const a = dst + ".work-a.jpg";
const b = dst + ".work-b.jpg";
const vig = dst + ".work-vig.png";
const clean = () => [a, b, vig].forEach((f) => fs.rmSync(f, { force: true }));
process.on("exit", clean);

// 1 + 2. Recorte y grade base
run([
  src,
  "-auto-orient",
  "-resize",
  `${W}x${H}^`,
  "-gravity",
  "center",
  "-extent",
  `${W}x${H}`,
  "-colorspace",
  "sRGB",
  "-sigmoidal-contrast",
  "8,50%",
  "-strip",
  a,
]);

// Viñeta: gradiente radial transparente→oscuro, multiplicado (sin tocar el centro)
run(["-size", `${W}x${H}`, "radial-gradient:none-#8a8a8a", vig]);
run([a, vig, "-compose", "multiply", "-composite", b]);
fs.rmSync(a, { force: true });

const lum = (file) =>
  Number(run([file, "-colorspace", "sRGB", "-format", "%[fx:round(100*mean)]", "info:"]));

let cur = b;
let other = a;
let l = lum(cur);
console.log(`Luminancia tras grade base: ${l} %`);

// 3. Pasadas de reducción hasta la banda objetivo
let pass = 0;
while (l > 32 && pass < 8) {
  run([cur, "-evaluate", "multiply", "0.85", other]);
  fs.rmSync(cur, { force: true });
  [cur, other] = [other, cur];
  l = lum(cur);
  pass++;
  console.log(`Pasada ${pass}: ${l} %`);
}
if (l < 20) {
  console.warn("⚠  Quedó más oscura que las demás tarjetas; prueba con una foto algo más luminosa.");
}

run([cur, "-quality", "82", "-strip", dst]);
clean();
console.log(`✔ Sustituida: ${dst}  (luminancia final ${l} % · banda objetivo 20–32 %)`);
console.log("   Siguiente paso: npm run build");
