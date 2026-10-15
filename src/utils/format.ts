export const euro = (n: number) =>
  n.toLocaleString("es-ES", {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  }) + " €";

export const pad2 = (n: number) => String(n).padStart(2, "0");
