import { Link, NavLink } from "react-router-dom";
import { FileText, Store } from "lucide-react";
import { BRAND } from "../../config.js";
import Wordmark from "../../components/Wordmark.jsx";
import { useOrcamento } from "./useOrcamento.js";

export function CabecalhoLoja() {
  const { total } = useOrcamento();

  return (
    <header className="sticky top-11 z-40 border-b border-base-300 bg-base-100/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <Link to="/exemplos/loja" className="flex items-center gap-3" aria-label="Vitrine">
          <Wordmark className="h-7" withText={false} />
          <span className="hidden font-display text-base font-semibold text-base-content sm:inline">
            Catálogo de Soluções
          </span>
        </Link>

        <nav className="flex items-center gap-2" aria-label="Loja">
          <NavLink
            to="/exemplos/loja"
            end
            className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-base-content/70 transition-colors duration-200 hover:text-base-content sm:inline-flex"
          >
            <Store className="h-4 w-4" />
            Vitrine
          </NavLink>

          <NavLink
            to="/exemplos/loja/orcamento"
            className="relative inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-content transition-transform duration-200 hover:-translate-y-0.5"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Meu orçamento</span>
            <span className="sm:hidden">Orçamento</span>
            {total > 0 && (
              <span
                className="grid h-5 min-w-5 place-items-center rounded-full bg-base-100 px-1.5 text-xs font-bold text-primary"
                aria-label={`${total} itens na lista`}
              >
                {total}
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export function RodapeLoja() {
  return (
    <footer className="border-t border-base-300 bg-base-100 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 text-center">
        <Wordmark className="h-7" />
        <p className="text-sm text-base-content/60">
          Nenhum preço é publicado: cada orçamento é feito sob medida, depois de entender o seu
          negócio.
        </p>
        <p className="text-xs text-base-content/40">
          Exemplar de e-commerce construído pela ogis.cloud · {BRAND.cidade}
        </p>
      </div>
    </footer>
  );
}
