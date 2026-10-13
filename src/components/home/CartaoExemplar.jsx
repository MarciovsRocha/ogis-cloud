import { Link } from "react-router-dom";
import { ArrowUpRight } from "@phosphor-icons/react";
import MiniaturaExemplar from "./MiniaturaExemplar.jsx";

export default function CartaoExemplar({ exemplar, mostrarDetalhe = false }) {
  return (
    <Link
      to={exemplar.para}
      className="group block h-full rounded-[2rem] bg-white/[0.03] p-1.5 ring-1 ring-white/10 transition-transform duration-500 ease-mola hover:-translate-y-1"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[calc(2rem-0.375rem)] bg-base-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="overflow-hidden">
          <div className="transition-transform duration-700 ease-mola group-hover:scale-[1.03]">
            <MiniaturaExemplar estilo={exemplar.estilo} />
          </div>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-xl font-semibold tracking-[-0.02em] text-base-content">{exemplar.nome}</h3>
          <p className="mt-2 text-sm text-base-content/70">{exemplar.resumo}</p>
          {mostrarDetalhe && <p className="mt-3 text-sm text-base-content/60">{exemplar.detalhe}</p>}
          <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-primary">
            Abrir exemplar
            <ArrowUpRight
              weight="bold"
              className="h-4 w-4 transition-transform duration-500 ease-mola group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
