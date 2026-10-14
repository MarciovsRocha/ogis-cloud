import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import SeloEscopo from "../../components/SeloEscopo.jsx";

// Lista editorial de soluções: substitui os cards no site sereno.
export default function ListaSolucoes({ itens, colunas = 1 }) {
  return (
    <ul className={`border-t border-base-300 ${colunas === 2 ? "md:grid md:grid-cols-2 md:gap-x-12" : ""}`}>
      {itens.map((item) => (
        <li key={item.slug} className="border-b border-base-300">
          <Link
            to={`/exemplos/site/solucoes/${item.slug}`}
            className="group flex items-start justify-between gap-6 py-6"
          >
            <span className="min-w-0">
              <span className="block text-lg font-bold tracking-[-0.02em] text-base-content">{item.nome}</span>
              <span className="mt-1 block text-base-content/70">{item.resumo}</span>
              <SeloEscopo item={item} className="mt-3" />
            </span>
            <ArrowRight
              className="mt-1.5 h-5 w-5 shrink-0 text-base-content/40 transition-all duration-500 ease-mola group-hover:translate-x-1 group-hover:text-primary"
              aria-hidden="true"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
