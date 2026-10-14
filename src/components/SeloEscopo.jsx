import { Clock } from "@phosphor-icons/react";
import { textoEscopo } from "../data/catalogo.js";

// Ocupa o lugar do preço: comunica escopo e prazo, não valor.
export default function SeloEscopo({ item, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-base-content/70 ${className}`}>
      <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {textoEscopo(item)}
    </span>
  );
}
