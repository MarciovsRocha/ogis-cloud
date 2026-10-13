import { Link } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import { TEMA_POR_SUPERFICIE } from "../styles/temas.js";
import Wordmark from "./Wordmark.jsx";

// Faixa fixa de 44px (h-11) no topo dos exemplares, sempre no tema da OGIS.
// ExemplarLayout usa pt-11 e os cabeçalhos dos exemplares usam top-11: se a
// altura mudar, os três mudam juntos.
export default function FaixaExemplar() {
  return (
    <div
      role="region"
      aria-label="Aviso de exemplar"
      data-theme={TEMA_POR_SUPERFICIE.faixa}
      className="fixed inset-x-0 top-0 z-(--z-faixa) border-b border-white/[0.08] bg-base-200/95 backdrop-blur-md"
    >
      <div className="mx-auto flex h-11 max-w-6xl items-center justify-between gap-3 px-4">
        <span className="inline-flex min-w-0 items-center gap-3 text-xs text-base-content/70">
          <Wordmark variante="simbolo" className="h-4 text-primary" />
          <span className="truncate">
            <strong className="font-medium text-base-content">Exemplar OGIS</strong>
            <span className="hidden sm:inline"> · demonstração navegável feita pela ogis.cloud</span>
          </span>
        </span>
        <Link
          to="/"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs text-primary transition-colors duration-300 ease-mola hover:bg-primary/10"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          voltar ao site
        </Link>
      </div>
    </div>
  );
}
