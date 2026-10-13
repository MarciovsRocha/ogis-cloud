import { slugTitulo } from "../lib/slug.js";

// Seção de página legal. O LegalLayout monta o índice a partir dos títulos.
export default function Secao({ titulo, children }) {
  return (
    <section id={slugTitulo(titulo)} className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold tracking-[-0.02em] text-base-content">{titulo}</h2>
      {children}
    </section>
  );
}
