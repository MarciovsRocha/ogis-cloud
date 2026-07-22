import { Link } from "react-router-dom";
import { ArrowLeft, FlaskConical } from "lucide-react";

// Barra fixa no topo dos exemplares. Fica acima de todo o chrome de cada
// demonstração, por isso os cabeçalhos dos exemplares começam abaixo dela.
export default function FaixaExemplar() {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] border-b border-primary/30 bg-primary/10 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
        <span className="inline-flex items-center gap-2 text-xs font-medium text-base-content/80">
          <FlaskConical className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span>
            <strong className="font-semibold text-base-content">Exemplar OGIS</strong>
            <span className="hidden sm:inline"> · demonstração navegável, feita pela ogis.cloud</span>
          </span>
        </span>
        <Link
          to="/"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-primary transition-colors duration-200 hover:bg-primary/15"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar ao site
        </Link>
      </div>
    </div>
  );
}
