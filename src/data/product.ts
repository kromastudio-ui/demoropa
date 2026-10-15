import heroImg from "@/assets/images/jacket-hero.jpg";
import collarImg from "@/assets/images/detail-collar.jpg";
import embroideryImg from "@/assets/images/detail-embroidery.jpg";
import cuffImg from "@/assets/images/detail-cuff.jpg";

export type StockState = "ok" | "low";
export type SizeId = "XS" | "S" | "M" | "L" | "XL";
export const SIZE_ORDER: SizeId[] = ["XS", "S", "M", "L", "XL"];

export interface SizeOption {
  id: SizeId;
  chest: number;
  length: number;
  sleeve: number;
  stock: StockState;
  note?: string;
}

export const announcement = [
  "Drop 01 en vivo",
  "Envío gratis a partir de 120 €",
  "Cambios gratis 30 días",
  "Paga en 3 plazos sin intereses",
];

export const shop = {
  freeShippingFrom: 120,
  shippingCost: 4.95,
};

export const product = {
  ref: "ATJ-01-WNR",
  drop: "Drop 01",
  series: "Track Series",
  name: ["ASYM", "TRACK", "JKT"],
  edition: "/01",
  tagline: "Chaqueta deportiva · Cropped · Cierre fuera de eje",
  price: 189,
  installments: "o 3 × 63 € sin intereses",
  image: heroImg,
  description:
    "Cremallera fuera de eje, cuerpo cortado a la cintura y mangas con más volumen del que necesitas. No es una chaqueta de calentamiento: es la que te pones para que el resto se enfríe.",
  fit: [
    { k: "Corte", v: "Cropped · largo a la cintura" },
    { k: "Manga", v: "Raglán oversized · puño recogido" },
    { k: "Cuello", v: "Funnel alto · solapa asimétrica" },
    { k: "Hombro", v: "Caído · sin costura superior" },
    { k: "Modelo", v: "177 cm · lleva talla S" },
  ],
  colorway: [
    { name: "Chalk", hex: "#eceef1" },
    { name: "Navy", hex: "#131f3d" },
    { name: "Signal", hex: "#e11b2f" },
  ],
  sizes: [
    { id: "XS", chest: 100, length: 46, sleeve: 62, stock: "ok" },
    { id: "S", chest: 104, length: 47, sleeve: 63, stock: "ok" },
    { id: "M", chest: 108, length: 48, sleeve: 64, stock: "ok", note: "La más pedida" },
    { id: "L", chest: 112, length: 49, sleeve: 65, stock: "low", note: "Quedan 2" },
    { id: "XL", chest: 116, length: 50, sleeve: 66, stock: "ok" },
  ] as SizeOption[],
  sizeNote:
    "Medidas de la prenda en plano (cm). ¿Entre dos tallas? Baja una: el volumen ya viene de serie.",
  howToMeasure: [
    "Pecho: de sisa a sisa, con la prenda cerrada.",
    "Largo: desde el punto más alto del hombro hasta el final del canalé.",
    "Manga: desde el cuello hasta el borde del puño (raglán).",
  ],
  stockLine: "En stock — sale hoy si pides antes de las 17:00",
  trust: ["Envío 24h", "Cambios 30 días", "Pago seguro"],
};

export interface InfoRow {
  k: string;
  v: string;
}

/** Pestañas del bloque inferior izquierdo del hero */
export const tabs: { id: string; label: string; rows: InfoRow[] }[] = [
  { id: "fit", label: "Fit", rows: product.fit },
  {
    id: "material",
    label: "Material",
    rows: [
      { k: "Cuerpo", v: "78% poliéster reciclado · 22% algodón" },
      { k: "Canalé", v: "92% algodón · 8% elastano" },
      { k: "Gramaje", v: "320 g/m² · interlock peached" },
      { k: "Herrajes", v: "Zamak pulido · sin níquel" },
      { k: "Origen", v: "Tejido y confección en Portugal" },
    ],
  },
  {
    id: "cuidados",
    label: "Cuidados",
    rows: [
      { k: "Lavado", v: "30 °C · del revés · cremallera cerrada" },
      { k: "Secado", v: "En plano · la secadora ni la mires" },
      { k: "Plancha", v: "Baja · nunca sobre el bordado" },
      { k: "Lejía", v: "No. Nunca. Por nada." },
      { k: "Color", v: "Fijado · no destiñe sobre el blanco" },
    ],
  },
  {
    id: "envio",
    label: "Envío",
    rows: [
      { k: "Península", v: "24–48 h · gratis desde 120 €" },
      { k: "Baleares", v: "48–72 h · 4,95 €" },
      { k: "UE", v: "3–5 días · 9,95 €" },
      { k: "Cambios", v: "30 días · gratis · sin interrogatorio" },
      { k: "Recogida", v: "En tienda · lista en 2 h" },
    ],
  },
];

export interface Hotspot {
  id: string;
  /** posición en % sobre el visor */
  x: number;
  y: number;
  title: string;
  body: string;
  /** id de la tarjeta de detalle relacionada */
  detail: string;
}

/** Puntos interactivos sobre la prenda (coordenadas medidas sobre la foto) */
export const hotspots: Hotspot[] = [
  {
    id: "01",
    x: 56,
    y: 11,
    title: "Cuello funnel fuera de eje",
    body: "Solapa alta con doble ojal metálico y ribete rojo. Cerrada hasta arriba: armadura. Caída: statement.",
    detail: "01",
  },
  {
    id: "02",
    x: 44,
    y: 35,
    title: "Firma a hilo",
    body: "Script bordado en relieve, navy que rompe en rojo. ±12.000 puntadas que se notan al pasar el dedo.",
    detail: "02",
  },
  {
    id: "03",
    x: 87,
    y: 87,
    title: "Puño canalé 2×2",
    body: "Recoge todo el volumen de la manga raglán y vuelve a su sitio lavado tras lavado.",
    detail: "03",
  },
  {
    id: "04",
    x: 50,
    y: 69,
    title: "Banda de cintura",
    body: "Canalé denso con elastano que fija el largo cropped exactamente donde debe: en la cintura.",
    detail: "03",
  },
];

export const specs = [
  {
    id: "01",
    title: "Cierre fuera de eje",
    body:
      "Cremallera desplazada al lado izquierdo con cursor metálico de doble vía. Ábrela por arriba, por abajo o a medias. La simetría es para los tímidos.",
    more:
      "El cursor principal lleva tirador de cordón para abrir con guantes; el segundo cursor ventila desde abajo sin perder el cuello cerrado.",
    meta: "Doble cursor · Zamak pulido",
  },
  {
    id: "02",
    title: "Interlock 320 g",
    body:
      "Punto interlock de poliéster reciclado con interior peached. Cuerpo suficiente para que el cropped no se desplome, tacto para que no quieras quitártela.",
    more:
      "El peached se consigue lijando el revés del tejido: más calor sin más peso. Poliéster reciclado con certificado GRS.",
    meta: "78% rPES · 22% CO · 320 g/m²",
  },
  {
    id: "03",
    title: "Movilidad raglán",
    body:
      "Manga raglán sin costura en el hombro y sisa amplia. Levanta los brazos, gira, corre al último tren. Se mueve contigo o no se mueve.",
    more:
      "Patrón probado en movimiento: sprint, sentadilla profunda y brazos en cruz sin que el cropped se suba por encima del canalé.",
    meta: "Rango de brazo 180° · Sin tirantez",
  },
  {
    id: "04",
    title: "Remates de pista",
    body:
      "Canalé denso con elastano en puños y cintura, ojales metálicos en el cuello, bordado a hilo en el pecho. Todo lo que roza, reforzado.",
    more:
      "Hilo de alta tenacidad en todas las costuras de carga. Doble pespunte en sisa y cintura; ojales remachados, no cosidos.",
    meta: "Canalé 2×2 · 8% elastano",
  },
];

export const details = [
  {
    id: "01",
    zone: "Cuello",
    label: "Zoom 01 — Cuello",
    title: "Cierre que no pide permiso",
    body:
      "La cremallera cruza el pecho en diagonal y remata en una solapa alta con doble ojal metálico y ribete rojo. Cerrada hasta arriba: armadura. Solapa caída: statement. Misma pieza, dos caras.",
    meta: "Ojales 8 mm · Ribete contraste",
    image: collarImg,
  },
  {
    id: "02",
    zone: "Frontal",
    label: "Zoom 02 — Frontal",
    title: "Firma a hilo, no a tinta",
    body:
      "Script en cursiva bordado en relieve, navy que rompe en rojo, con relleno denso que se nota al tacto y no se cuartea. Al lado, el parche de bandera tejido con bordes termosellados. El logo de siempre en la pieza que nadie esperaba.",
    meta: "Hilo poliéster 40 · ±12.000 puntadas",
    image: embroideryImg,
  },
  {
    id: "03",
    zone: "Remates",
    label: "Zoom 03 — Remates",
    title: "Canalé que aguanta el pulso",
    body:
      "Puños y banda inferior en canalé navy de alta densidad con elastano. Recogen el volumen de la manga, fijan el largo cropped a la cintura y vuelven a su sitio lavado tras lavado. La silueta se sujeta aquí.",
    meta: "Canalé 2×2 · Recuperación 97%",
    image: cuffImg,
  },
];

export const marquee = [
  "ASYM TRACK JKT /01",
  "Drop 01",
  "Cropped",
  "Cierre fuera de eje",
  "Interlock 320 g",
  "Chalk / Navy / Signal",
];

export const fitFinder = {
  title: "¿Qué talla soy?",
  intro: "Dos datos y te la decimos. Sin formularios eternos ni «depende».",
  result: {
    ajustado:
      "Te quedará pegada al torso con la manga todavía suelta. La versión más sastre de la pieza.",
    foto: "Igual que en la ficha: cropped en la cintura, hombro caído, manga con caída.",
    oversize:
      "Más caja, más manga, más calle. El canalé sigue sujetando el largo en la cintura.",
  },
  footnote: "Orientativo · si dudas entre dos, baja una",
};
