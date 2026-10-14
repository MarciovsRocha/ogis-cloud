import { Link, NavLink } from "react-router-dom";
import { FileText } from "@phosphor-icons/react";
import { BRAND } from "../../config.js";
import Wordmark from "../../components/Wordmark.jsx";
import { useOrcamento } from "./useOrcamento.js";

export function CabecalhoLoja() {
  const { total } = useOrcamento();

  return (
    <header className="sticky top-11 z-(--z-cabecalho) border-b border-base-300 bg-base-100/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <Link to="/exemplos/loja" className="flex items-center gap-2.5" aria-label="catálogo ogis — vitrine">
          <Wordmark variante="simbolo" className="h-6 text-primary" />
          <span className="text-lg font-extrabold tracking-[-0.03em] text-base-content">catálogo ogis</span>
        </Link>

        <nav className="flex items-center gap-2" aria-label="Loja">
          <NavLink
            to="/exemplos/loja"
            end
            className={({ isActive }) =>
              `hidden rounded-full px-4 py-2 text-sm font-bold transition-colors duration-300 ease-mola sm:inline-block ${
                isActive ? "bg-base-200 text-base-content" : "text-base-content/70 hover:text-base-content"
              }`
            }
          >
            Vitrine
          </NavLink>
          <NavLink
            to="/exemplos/loja/orcamento"
            className="inline-flex items-center gap-2 rounded-2xl bg-secondary px-4 py-2.5 text-sm font-bold text-secondary-content transition-transform duration-300 ease-mola active:scale-[0.97]"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Orçamento
            <span
              key={total}
              className="contador-pulo grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-xs text-primary-content"
              aria-label={`${total} ${total === 1 ? "item" : "itens"} na lista`}
            >
              {total}
            </span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export function RodapeLoja() {
  return (
    <footer className="bg-secondary text-secondary-content">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-lg font-extrabold tracking-[-0.03em]">catálogo ogis</span>
        <p className="max-w-md text-sm opacity-85">
          Nenhum preço é publicado: cada orçamento é feito sob medida, depois de entender o seu negócio.
        </p>
      </div>
      <p className="mx-auto max-w-6xl px-5 pb-8 text-xs opacity-75">
        Exemplar de e-commerce construído pela ogis.cloud · {BRAND.cidade}
      </p>
    </footer>
  );
}
