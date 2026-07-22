import { Clock } from "lucide-react";
import { textoEscopo } from "../data/catalogo.js";

// Ocupa o lugar do preço nos cards. Comunica escopo e prazo, não valor —
// a cotação é sempre manual.
export default function SeloEscopo({ item, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-base-300 bg-base-200 px-3 py-1 text-xs font-medium text-base-content/70 ${className}`}
    >
      <Clock className="h-3.5 w-3.5 text-accent" />
      {textoEscopo(item)}
    </span>
  );
}
